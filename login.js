// 批量登录脚本：读取emails.txt，格式为email----password，批量登录并生成token到tokens.txt
import { axios, fs } from './utils/exporter.js';

// 保存token到tokens.txt文件
function saveTokenToFile(token) {
    try {
        fs.appendFileSync('tokens.txt', token + '\n');
        console.log('Access token saved to tokens.txt');
    } catch (error) {
        console.error("Error saving token to file:", error.message);
    }
}

// 登录用户，获取token并保存
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
            saveTokenToFile(token);
        } else {
            console.error(`Login failed for ${email}:`, response.data.message);
        }
    } catch (error) {
        console.error(`Error during login for ${email}:`, error.message);
    }
}

// 处理所有用户邮箱，批量登录
async function processAllUsers() {
    try {
        // 读取emails.txt中的所有账号和密码，格式为email----password
        const lines = fs.readFileSync('emails.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const [email, password] = line.split('----');
            if (email && password) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await loginUser(email.trim(), password.trim());
            } else {
                console.error(`Invalid line format: ${line}`);
            }
        }
    } catch (error) {
        console.error("Error reading emails.txt file:", error.message);
    }
}

// 主入口，执行批量处理
processAllUsers();
