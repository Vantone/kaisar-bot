import * as Upils from './utils/exporter.js';

async function pingAndUpdate(token, extensionId, proxy) {
    const agent = new Upils.HttpsProxyAgent(proxy);

    const apiClient = Upils.axios.create({
        baseURL: 'https://zero-api.kaisar.io/',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        agent,
    });

    try {
        const response = await apiClient.post('/extension/ping', {
            extension: extensionId
        });

        Upils.logger(`[${extensionId}] Ping response:`, 'info', response.data.data);
        await Upils.getMiningData(apiClient, extensionId);  
    } catch (error) {
        Upils.logger(`[${extensionId}] Ping error with proxy ${proxy}`, 'error');
    }
}

(async () => {
    Upils.logger(Upils.banner, 'debug')
    const tokens = Upils.getToken();
    const ids = Upils.getId();
    const proxies = Upils.getProxy();

    if (!tokens.length || !ids.length || !proxies.length) {
        Upils.logger("No tokens, IDs, or proxies found. Exiting...", 'error');
        return;
    }

    const lastExecution = {}; 

    // while (true) {
    //     const now = Date.now();

    //     for (let i = 0; i < tokens.length; i++) {
    //         const token = tokens[i];
    //         const extensionId = ids[i % ids.length];
    //         const proxy = proxies[i % proxies.length];

    //         Upils.logger(`[${extensionId}] Starting ping for Account #${i + 1}, with proxy ${proxy}`);
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         await pingAndUpdate(token, extensionId, proxy);

    //         if (!lastExecution[token] || now - lastExecution[token] >= 24 * 60 * 60 * 1000) {
    //             Upils.logger(`[${extensionId}] Checking tasks for Account #${i + 1}`);
    //             await Upils.checkAndClaimTask(extensionId, proxy, token);
    //             await Upils.dailyCheckin(extensionId, proxy, token);

    //             lastExecution[token] = now;
    //         }
    //     }

    //     Upils.logger(`[${new Date().toISOString()}] Cooldown 1 minute...`);
    //     await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute
    // }
    while (true) {
        const now = Date.now();
    
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const extensionId = ids[i % ids.length];
            const proxy = proxies[i % proxies.length];
    
            Upils.logger(`[${extensionId}] 开始 Ping 第 ${i + 1} 个账户，使用代理 ${proxy}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await pingAndUpdate(token, extensionId, proxy);
    
            if (!lastExecution[token] || now - lastExecution[token] >= 24 * 60 * 60 * 1000) {
                Upils.logger(`[${extensionId}] 检查任务 第 ${i + 1} 个账户`);
                await Upils.checkAndClaimTask(extensionId, proxy, token);
                await Upils.dailyCheckin(extensionId, proxy, token);
    
                lastExecution[token] = now;
            }
        }
    
        // 计算到下一次上午 8 点的时间差
        const current = new Date();
        const nextRun = new Date(current);
        nextRun.setDate(current.getDate() + (current.getHours() >= 8 ? 1 : 0)); // 如果当前时间已经过了上午 8 点，则设置为第二天
        nextRun.setHours(8, 0, 0, 0); // 设置为上午 8 点
    
        const waitTime = nextRun - current; // 计算等待的毫秒数
        Upils.logger(`[${new Date().toISOString()}] 冷却至明天上午 8 点...`);
        await new Promise(resolve => setTimeout(resolve, waitTime)); // 等待至上午 8 点
    }
})();
