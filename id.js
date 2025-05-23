// 生成自定义数量的 UUID 并保存到 uuid_list.txt
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import readline from 'readline';

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('请输入要生成的 UUID 数量：', (answer) => {
        const count = parseInt(answer);
        if (isNaN(count) || count <= 0) {
            console.log('请输入有效的正整数！');
            rl.close();
            return;
        }
        const uuids = [];
        for (let i = 0; i < count; i++) {
            uuids.push(uuidv4());
        }
        fs.writeFileSync('id.txt', uuids.join('\n') + '\n');
        console.log(`已生成 ${count} 个 UUID 并保存到 id.txt`);
        rl.close();
    });
}

main();
