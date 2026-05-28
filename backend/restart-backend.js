const { execSync } = require('child_process');

try {
  const output = execSync('wmic process where "name=\'node.exe\'" get ProcessId, CommandLine', { encoding: 'utf-8' });
  const lines = output.split('\n');
  let killed = false;
  for (const line of lines) {
    if (line.includes('backend') || line.includes('index.js')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (!isNaN(parseInt(pid))) {
        console.log(`Killing node process ${pid} (${line.trim()})`);
        execSync(`taskkill /F /PID ${pid}`);
        killed = true;
      }
    }
  }
  if (!killed) {
    console.log("No backend process found.");
  }
} catch (e) {
  console.log("Error checking processes:", e.message);
}
