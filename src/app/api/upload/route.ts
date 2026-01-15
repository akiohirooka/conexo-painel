import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const VALID_ENTITIES = ['users', 'business', 'events', 'jobs'] as const;
const VALID_TYPES = ['avatar', 'logo', 'cover', 'gallery'] as const;

type Entity = typeof VALID_ENTITIES[number];
type Type = typeof VALID_TYPES[number];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const entity = formData.get('entity') as string;
    const type = formData.get('type') as string;
    const entityIdParam = formData.get('entityId') as string | null;

    // 1. Basic Validation
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    if (!VALID_ENTITIES.includes(entity as Entity)) {
      return NextResponse.json({ error: 'Invalid or missing entity' }, { status: 400 });
    }
    if (!VALID_TYPES.includes(type as Type)) {
      return NextResponse.json({ error: 'Invalid or missing type' }, { status: 400 });
    }

    // 2. Entity Logic & ID Resolution + Persistence Validation
    let finalEntityId = entityIdParam;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (entity === 'users') {
      finalEntityId = userId;
    } else {
      // For business, events, jobs, entityId is mandatory and must be validated
      if (!finalEntityId || isNaN(Number(finalEntityId))) {
        return NextResponse.json({ ok: false, error: `Valid entityId is required for ${entity}` }, { status: 400 });
      }

      const idBigInt = BigInt(finalEntityId);
      let allowed = false;

      // Validation for ownership
      if (entity === 'business') {
        const record = await db.businesses.findFirst({
          where: {
            id: idBigInt,
            clerk_user_id: userId
          },
          select: { id: true }
        });
        allowed = !!record;
      } else if (entity === 'events') {
        const record = await db.events.findFirst({
          where: {
            id: idBigInt,
            clerk_user_id: userId
          },
          select: { id: true }
        });
        allowed = !!record;
      } else if (entity === 'jobs') {
        const record = await db.jobs.findFirst({
          where: {
            id: idBigInt,
            clerk_user_id: userId
          },
          select: { id: true }
        });
        allowed = !!record;
      }

      if (!allowed) {
        return NextResponse.json({ ok: false, error: 'Forbidden: You do not own this entity' }, { status: 403 });
      }
    }

    // 3. Key Generation Logic
    const fileObject = file as File;
    const buffer = Buffer.from(await fileObject.arrayBuffer());

    const nameParts = fileObject.name.split('.');
    let extension = nameParts.length > 1 ? nameParts.pop() : '';
    if (!extension) {
      const mimeSub = fileObject.type.split('/')[1];
      if (mimeSub) extension = mimeSub;
    }
    extension = extension?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';

    const safeFileName = fileObject.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();

    let key = '';

    if (entity === 'users' && type === 'avatar') {
      key = `users/${finalEntityId}/avatar/avatar.${extension}`;
    } else if (entity === 'business' && type === 'logo') {
      key = `business/${finalEntityId}/logo/logo.${extension}`;
    } else if (entity === 'business' && type === 'gallery') {
      key = `business/${finalEntityId}/gallery/${timestamp}-${safeFileName}`;
    } else if (entity === 'events' && type === 'cover') {
      key = `events/${finalEntityId}/cover/cover.${extension}`;
    } else if (entity === 'events' && type === 'gallery') {
      key = `events/${finalEntityId}/gallery/${timestamp}-${safeFileName}`;
    } else if (entity === 'jobs' && type === 'cover') {
      key = `jobs/${finalEntityId}/cover/cover.${extension}`;
    } else if (entity === 'jobs' && type === 'gallery') {
      key = `jobs/${finalEntityId}/gallery/${timestamp}-${safeFileName}`;
    } else {
      return NextResponse.json({ ok: false, error: `Invalid type '${type}' for entity '${entity}'` }, { status: 400 });
    }

    if (!process.env.R2_BUCKET) {
      throw new Error('R2_BUCKET environment variable is missing');
    }

    // 4. Upload to R2
    try {
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: fileObject.type,
        })
      );
    } catch (uploadError: any) {
      console.error('R2 Upload error:', uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message || 'Upload to storage failed' },
        { status: 500 }
      );
    }

    // 5. Persist Key to Database (Business only)
    if (entity === 'business' && finalEntityId) {
      const idBigInt = BigInt(finalEntityId);

      try {
        if (type === 'gallery') {
          await db.businesses.update({
            where: { id: idBigInt },
            data: {
              gallery_images: {
                push: key
              }
            }
          });
        } else if (type === 'logo') {
          await db.businesses.update({
            where: { id: idBigInt },
            data: {
              logo_url: key
            }
          });
        } else if (type === 'cover') {
          await db.businesses.update({
            where: { id: idBigInt },
            data: {
              cover_image_url: key
            }
          });
        }
      } catch (dbError: any) {
        console.error('Database update error:', dbError);
        return NextResponse.json(
          { ok: false, error: `Upload successful but database update failed: ${dbError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true, key });

  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Unexpected upload error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const json = await req.json();
    const { entity, type, entityId, key } = json;

    if (!entity || !type || !key) {
      return NextResponse.json({ ok: false, error: 'Missing required fields: entity, type, key' }, { status: 400 });
    }

    if (!VALID_ENTITIES.includes(entity as Entity)) {
      return NextResponse.json({ ok: false, error: 'Invalid entity' }, { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    let finalEntityId = entityId;
    if (entity === 'users') {
      finalEntityId = userId;
    } else {
      if (!finalEntityId || isNaN(Number(finalEntityId))) {
        return NextResponse.json({ ok: false, error: 'Valid entityId is required' }, { status: 400 });
      }

      const idBigInt = BigInt(finalEntityId);
      let allowed = false;

      if (entity === 'business') {
        const record = await db.businesses.findFirst({
          where: { id: idBigInt, clerk_user_id: userId },
          select: { id: true }
        });
        allowed = !!record;
      } else if (entity === 'events') {
        const record = await db.events.findFirst({
          where: { id: idBigInt, clerk_user_id: userId },
          select: { id: true }
        });
        allowed = !!record;
      } else if (entity === 'jobs') {
        const record = await db.jobs.findFirst({
          where: { id: idBigInt, clerk_user_id: userId },
          select: { id: true }
        });
        allowed = !!record;
      }

      if (!allowed) {
        return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    // Delete from R2
    if (!process.env.R2_BUCKET) {
      throw new Error('R2_BUCKET environment variable is missing');
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
    );

    // Update DB (only for business for now as requested)
    if (entity === 'business' && finalEntityId) {
      const idBigInt = BigInt(finalEntityId);

      if (type === 'gallery') {
        // Need to fetch current array to remove item since Prisma doesn't have 'pull' for scalar lists easily in update without set? 
        // Actually, for scalar lists (String[]), we can set it to the filtered array.
        const current = await db.businesses.findUnique({
          where: { id: idBigInt },
          select: { gallery_images: true }
        });

        if (current?.gallery_images) {
          const newGallery = current.gallery_images.filter(k => k !== key);
          await db.businesses.update({
            where: { id: idBigInt },
            data: { gallery_images: newGallery }
          });
        }

      } else if (type === 'logo') {
        // Only set to null if it matches the key being deleted
        /* 
           Performance Note: We could blindly set null, but better only if it matches? 
           The prompt says: "se logo_url === key, setar logo_url = null"
        */
        const current = await db.businesses.findUnique({
          where: { id: idBigInt },
          select: { logo_url: true }
        });
        if (current?.logo_url === key) {
          await db.businesses.update({
            where: { id: idBigInt },
            data: { logo_url: null }
          });
        }

      } else if (type === 'cover') {
        const current = await db.businesses.findUnique({
          where: { id: idBigInt },
          select: { cover_image_url: true }
        });
        if (current?.cover_image_url === key) {
          await db.businesses.update({
            where: { id: idBigInt },
            data: { cover_image_url: null }
          });
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Delete operation failed' },
      { status: 500 }
    );
  }
}
