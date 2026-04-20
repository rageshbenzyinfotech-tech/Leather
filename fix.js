const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const apiFiles = walkSync('src/app/api').filter(f => f.endsWith('.ts'));

apiFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  if (content.includes('cookies().get')) {
    content = content.replace(/cookies\(\)\.get/g, '(await cookies()).get');
    changed = true;
  }
  if (content.includes('cookies().set')) {
    content = content.replace(/cookies\(\)\.set/g, '(await cookies()).set');
    changed = true;
  }
  if (content.includes('cookies().delete')) {
    content = content.replace(/cookies\(\)\.delete/g, '(await cookies()).delete');
    changed = true;
  }

  // Handle params type for Next.js 15
  if (content.match(/{ params }: { params: { ([a-zA-Z0-9_]+): string }? }/)) {
    content = content.replace(
      /{ params }: { params: { ([a-zA-Z0-9_]+): string }? }/g,
      '{ params }: { params: Promise<{ $1: string }> }'
    );
    // replace `params.id` or `params.identifier` with `(await params).$1`
    content = content.replace(/params\.([a-zA-Z0-9_]+)/g, '(await params).$1');
    changed = true;
  }

  // Also catch this pattern: { params }: { params: { id: string } }
  if (content.match(/\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*[a-zA-Z0-9_]+\s*:\s*string\s*\}\s*\}/)) {
      content = content.replace(/\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*([a-zA-Z0-9_]+)\s*:\s*string\s*\}\s*\}/g, '{ params }: { params: Promise<{ $1: string }> }');
      content = content.replace(/params\.([a-zA-Z0-9_]+)/g, '(await params).$1');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
