// 支持自定义最大并发线程数的批量登录脚本：读取emails.txt，格式为email----password，并发登录后按顺序写入token到tokens.txt
import { axios, fs } from './utils/exporter.js';

// 最大并发线程数，可根据需要修改
const maxConcurrency = 5; // 例如设置为5线程并发

function saveTokensToFile(tokens) {
    try {
        fs.writeFileSync('tokens.txt', tokens.join('\n') + '\n');
        console.log('All access tokens saved to tokens.txt');
    } catch (error) {
        console.error("Error saving tokens to file:", error.message);
    }
}

async function loginUser(email, password) {
    try {
        const response = await axios.post(
            'https://zero-api.kaisar.io/auth/login',
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data && response.data.data && response.data.data.accessToken) {
            const token = response.data.data.accessToken;
            console.log(`Login successful for ${email} Token:`, token);
            return token;
        } else {
            console.error(`Login failed for ${email}:`, response.data.message);
            return '';
        }
    } catch (error) {
        console.error(`Error during login for ${email}:`, error.message);
        return '';
    }
}

// 控制并发批量处理
async function processAllUsers() {
    try {
        const lines = fs.readFileSync('emails.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
        const tokens = new Array(lines.length).fill('');
        let current = 0;
        async function worker() {
            while (true) {
                let idx;
                // 线程安全地获取下一个索引
                if (current >= lines.length) return;
                idx = current;
                current++;
                const line = lines[idx];
                const [email, password] = line.split('----');
                if (email && password) {
                    tokens[idx] = await loginUser(email.trim(), password.trim());
                } else {
                    console.error(`Invalid line format: ${line}`);
                    tokens[idx] = '';
                }
            }
        }
        // 启动 maxConcurrency 个 worker
        const workers = [];
        for (let i = 0; i < maxConcurrency; i++) {
            workers.push(worker());
        }
        await Promise.all(workers);
        saveTokensToFile(tokens);
    } catch (error) {
        console.error("Error reading emails.txt file:", error.message);
    }
}

processAllUsers();
