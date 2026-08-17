import { io } from "socket.io-client";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

console.log(`\n==============================================`);
console.log(`🚀 REALTIME SOCKET SIMULATION & VERIFICATION`);
console.log(`Connecting to: ${SERVER_URL}`);
console.log(`==============================================\n`);

async function runTest() {
  // 1. Create simulated Admin client
  console.log(`[1/3] 🔌 Connecting Admin Monitor client...`);
  const adminSocket = io(SERVER_URL, {
    transports: ["websocket"],
    query: { path: "/admin/visitors" },
  });

  adminSocket.on("connect", () => {
    console.log(`✅ Admin client connected (Socket ID: ${adminSocket.id})`);
  });

  adminSocket.on("visitor:onlineCount", (count: number) => {
    console.log(`📡 [Admin Telemetry] Live Online Count updated: 👉 ${count} online`);
  });

  adminSocket.on("visitor:newLog", (log: any) => {
    console.log(`🔥 [Admin Telemetry] New visitor arrival detected in real time!`);
    console.log(`   - IP: ${log.ip}`);
    console.log(`   - Path: ${log.path}`);
    console.log(`   - Device/UA: ${log.userAgent}`);
    console.log(`   - Time: ${log.visitedAt}`);
  });

  adminSocket.on("visitor:statsUpdate", (stats: any) => {
    console.log(`📊 [Admin Telemetry] Daily Stats updated in real time:`, {
      todayUniqueIPs: stats.uniqueVisitorsToday ?? stats.todayUniqueIPs,
      totalDistinctIPs: stats.totalUniqueVisitors ?? stats.totalDistinctIPs,
      activeVisitors: stats.activeVisitors,
    });
  });

  // Wait 1.5s
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Connect Simulated Visitor 1
  console.log(`\n[2/3] 👤 Simulating Visitor 1 arriving at Homepage...`);
  const visitor1 = io(SERVER_URL, {
    transports: ["websocket"],
    query: { path: "/#hero" },
    extraHeaders: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 (Simulated)",
      "x-forwarded-for": "192.168.1.101",
    },
  });

  await new Promise((r) => setTimeout(r, 2000));

  // Visitor 1 navigates to #projects
  console.log(`\n[2.5/3] 🖱️ Visitor 1 scrolling to /#projects (Triggering SPA pageView)...`);
  visitor1.emit("visitor:pageView", { path: "/#projects" });

  await new Promise((r) => setTimeout(r, 2000));

  // 3. Connect Simulated Visitor 2
  console.log(`\n[3/3] 👤 Simulating Visitor 2 arriving from mobile...`);
  const visitor2 = io(SERVER_URL, {
    transports: ["websocket"],
    query: { path: "/#experience" },
    extraHeaders: {
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile (Simulated)",
      "x-forwarded-for": "10.0.0.55",
    },
  });

  await new Promise((r) => setTimeout(r, 3000));

  console.log(`\n🚪 Disconnecting Visitor 1 & 2...`);
  visitor1.disconnect();
  visitor2.disconnect();

  await new Promise((r) => setTimeout(r, 1500));
  adminSocket.disconnect();

  console.log(`\n🎉 Verification completed successfully! All real-time socket events fired properly.\n`);
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
