const fs = require('fs');
const readline = require('readline');

async function search() {
  const fileStream = fs.createReadStream('C:\\Users\\ameri\\.gemini\\antigravity\\brain\\7330053d-f845-44eb-b293-1c1170cc1225\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.source === 'MODEL' && obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
          const contentStr = JSON.stringify(call.args);
          if (contentStr.includes('function MainDashboard')) {
             console.log(`\n\n--- INSTRUCTION: ${call.args.Instruction} ---`);
             console.log(contentStr.slice(0, 1500));
          }
        }
      }
    }
  }
}

search();
