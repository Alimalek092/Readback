import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';

  const data = db.exportUserData(user.id);

  if (format === 'markdown') {
    let md = `# ReadBack Knowledge Export\n`;
    md += `*Reader: ${user.displayName} (${user.email})*\n`;
    md += `*Exported on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}*\n\n`;
    md += `---\n\n`;

    const books = db.getBooks(user.id);
    for (const book of books) {
      md += `## ${book.title}\n`;
      md += `**Author:** ${book.author} | **Status:** ${book.status} | **Progress:** ${book.progressPercentage}%\n\n`;

      const bookNotes = db.getNotes(user.id, book.id);
      if (bookNotes.length === 0) {
        md += `*No notes saved yet for this book.*\n\n`;
      } else {
        for (const note of bookNotes) {
          const title = note.title ? `### ${note.title}\n` : `### [${note.noteType.toUpperCase()}]\n`;
          md += title;
          md += `> ${note.content.replace(/\n/g, '\n> ')}\n\n`;
          if (note.pageNumber) {
            md += `*Page ${note.pageNumber}*\n\n`;
          }
          if (note.personalReflection) {
            md += `**Personal Application / Reflection:**\n${note.personalReflection}\n\n`;
          }
          if (note.tags.length > 0) {
            md += `*Tags:* ${note.tags.map((t) => `#${t}`).join(' ')}\n\n`;
          }
        }
      }
      md += `---\n\n`;
    }

    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="readback-export-${user.id}.md"`,
      },
    });
  }

  // Default JSON export
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="readback-data-${user.id}.json"`,
    },
  });
}
