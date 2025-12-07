// // // const express = require("express");
// // // const cors = require("cors");
// // // const net = require("net");

// // // const app = express();
// // // app.use(express.json());
// // // app.use(cors());

// // // // map category → printer IP
// // // const PRINTERS = {
// // //   kitchen: "192.168.1.10",
// // //   bar: "192.168.1.11",
// // //   receipt: "192.168.1.12"
// // // };

// // // function sendToPrinter(ip, text) {
// // //   return new Promise((resolve, reject) => {
// // //     try {
// // //       const socket = new net.Socket();
// // //       socket.connect(9100, ip, () => {
// // //         socket.write(text);
// // //         socket.end();
// // //       });

// // //       socket.on("close", () => resolve(true));
// // //       socket.on("error", (err) => reject(err));

// // //     } catch (err) {
// // //       reject(err);
// // //     }
// // //   });
// // // }

// // // app.post("/api/print-order", async (req, res) => {
// // //   const order = req.body;

// // //   // extract categories
// // //   const categories = [...new Set(order.items.map(i => i.category))];

// // //   // always receipt
// // //   if (!categories.includes("receipt"))
// // //     categories.push("receipt");

// // //   const status = {};

// // //   for (const cat of categories) {
// // //     const ip = PRINTERS[cat];
// // //     if (!ip) {
// // //       status[cat] = "NO PRINTER CONFIG";
// // //       continue;
// // //     }

// // //     try {
// // //       await sendToPrinter(ip, buildPrintText(order, cat));
// // //       status[cat] = "SENT";
// // //     } catch (err) {
// // //       status[cat] = "ERROR";
// // //     }
// // //   }

// // //   res.json({ ok: true, status });
// // // });

// // // function buildPrintText(order, category) {
// // //   const items = order.items.filter(i => i.category === category);

// // //   let text = `ORDER #${order.orderNumber}\n`;
// // //   text += `Category: ${category}\n`;
// // //   text += `------------------------\n`;

// // //   items.forEach(i => {
// // //     text += `${i.name} x${i.quantity}\n`;
// // //   });

// // //   text += `------------------------\n\n`;
// // //   return text;
// // // }

// // // app.listen(3000, () =>
// // //   console.log("Printer server running on port 3000")
// // // );
// // const express = require("express");
// // const cors = require("cors");
// // const fs = require("fs");
// // const { exec } = require("child_process");
// // const net = require("net");

// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // /* ------------------ Printer config -------------------- */
// // const PRINTERS = {
// //   kitchen: { name: 'Microsoft Print to PDF', saveToFile: true },
// //   // kitchen: {
// //   //   type: "network",
// //   //   ip: "192.168.1.55"
// //   // },
// //   bar: {
// //     type: "windows",
// //     share: "\\\\YOUR-PC\\BarPrinter"
// //   },
// //   receipt: {
// //     type: "network",
// //     ip: "192.168.1.57"
// //   }
// // };


// // /* ------------------ Network RAW printing -------------------- */
// // function sendNetwork(ip, text) {
// //   return new Promise((resolve, reject) => {
// //     const socket = new net.Socket();

// //     socket.connect(9100, ip, () => {
// //       socket.write(text);
// //       socket.end();
// //     });

// //     socket.on("close", () => resolve(true));
// //     socket.on("error", (err) => reject(err));
// //   });
// // }


// // /* ------------------ Windows shared printer -------------------- */
// // function sendWindows(share, text) {
// //   return new Promise((resolve, reject) => {
// //     const tmpFile = `print_${Date.now()}.txt`;

// //     fs.writeFileSync(tmpFile, text);

// //     const cmd = `print /D:${share} ${tmpFile}`;

// //     exec(cmd, (error, stdout, stderr) => {
// //       fs.unlinkSync(tmpFile);

// //       if (error) return reject(stderr);
// //       resolve(true);
// //     });
// //   });
// // }


// // /* ------------------ Build text from order -------------------- */
// // function buildPrint(order, category) {
// //   const items = order.items.filter(i => i.category === category);

// //   let text = `ORDER #${order.orderNumber}\n`;
// //   text += `CATEGORY: ${category}\n`;
// //   text += `-------------------\n`;

// //   items.forEach(it => {
// //     text += `${it.name} x${it.quantity}\n`
// //   });

// //   text += `-------------------\n\n`;
// //   return text;
// // }


// // /* ------------------ Print order -------------------- */
// // app.post("/api/print-order", async (req, res) => {
// //   const order = req.body;

// //   let categories = [...new Set(order.items.map(i => i.category))];
// //   if (!categories.includes("receipt")) categories.push("receipt");

// //   const status = {};

// //   for (let cat of categories) {
// //     const p = PRINTERS[cat];
// //     if (!p) {
// //       status[cat] = "NO CONFIG";
// //       continue;
// //     }

// //     try {
// //       let text = buildPrint(order, cat);

// //       if (p.type === "network") {
// //         await sendNetwork(p.ip, text);
// //         status[cat] = "NETWORK OK";
// //       }

// //       if (p.type === "windows") {
// //         await sendWindows(p.share, text);
// //         status[cat] = "WINDOWS OK";
// //       }

// //     } catch (err) {
// //       status[cat] = "ERROR";
// //     }
// //   }

// //   res.json({ ok: true, status });
// // });


// // app.listen(3000, () =>
// //   console.log("Printer server running on 3000")
// // );

// // ============================================
// // SIMPLE PRINT SERVER WITH MULTIPLE CATEGORY
// // ============================================

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// const app = express();
// const PORT = 3000;
// const HOST = '0.0.0.0'; // Listen on all network interfaces

// // ================= CORS =================
// app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
// app.use(bodyParser.json({ limit: '20mb' }));

// // ================= OUTPUT FOLDER =================
// const OUTPUT_DIR = path.join(__dirname, 'print-outputs');
// if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// // =================== Utilities ===================
// function getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === 'IPv4' && !iface.internal) return iface.address;
//     }
//   }
//   return 'localhost';
// }

// function savePrintFile(category, content, orderId) {
//   try {
//     const fileName = `${category}_${orderId || Date.now()}.html`;
//     const filePath = path.join(OUTPUT_DIR, fileName);
//     fs.writeFileSync(filePath, content, 'utf8');
//     console.log(`[INFO] Saved ${category} print: ${filePath}`);
//     return `/outputs/${fileName}`;
//   } catch (err) {
//     console.error(`[ERROR] Failed to save ${category} print:`, err);
//     return null;
//   }
// }

// // ================= PRINTER CONFIG =================
// // For real printers, replace `saveToFile: true` with printer name & logic
// const PRINTER_CONFIG = {
//   kitchen: { name: 'KITCHEN_PRINTER', saveToFile: true },
//   bar: { name: 'BAR_PRINTER', saveToFile: true },
//   receipt: { name: 'RECEIPT_PRINTER', saveToFile: true }
// };

// // =================== ROUTES ===================

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'online', timestamp: new Date().toISOString() });
// });

// // View outputs folder
// app.get('/outputs', (req,res) => {
//   res.sendFile(path.join(__dirname,'print-outputs'));
// });

// // Print route
// app.post('/api/print', (req, res) => {
//   try {
//     const { order, categoryDesigns } = req.body;

//     if (!order || !order.items || !categoryDesigns) {
//       return res.status(400).json({ ok:false, error: 'Invalid order or designs data' });
//     }

//     const results = {};

//     for (const category of Object.keys(PRINTER_CONFIG)) {
//       const config = PRINTER_CONFIG[category];
//       const content = categoryDesigns[category];

//       if (!content) {
//         results[category] = 'NO_DESIGN_PROVIDED';
//         continue;
//       }

//       if (config.saveToFile) {
//         const fileUrl = savePrintFile(category, content, order.orderNumber);
//         results[category] = fileUrl ? 'SAVED' : 'ERROR';
//       } else {
//         // TODO: implement real printer logic here
//         console.log(`[INFO] Sending to printer ${config.name} for category ${category}`);
//         results[category] = 'PRINTED';
//       }
//     }

//     res.json({ ok:true, status: results });
//   } catch (err) {
//     console.error('[ERROR] /api/print failed:', err);
//     res.status(500).json({ ok:false, error: err.message });
//   }
// });

// // =================== START SERVER ===================
// app.listen(PORT, HOST, () => {
//   const ip = getLocalIP();
//   console.log(`\n🖨️  PRINT SERVER READY`);
//   console.log(`Local:   http://localhost:${PORT}`);
//   console.log(`Network: http://${ip}:${PORT}`);
//   console.log(`Print outputs folder: ${OUTPUT_DIR}\n`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// ================= Folders =================
const OUTPUT_DIR = path.join(__dirname, 'print-outputs');
const LOGS_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

// ================= Middleware =================
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
app.use(bodyParser.json({ limit: '20mb' }));

// ================= Utilities =================
function log(message) {
  const logFile = path.join(LOGS_DIR, 'print.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

function savePrintFile(category, htmlContent, orderNumber) {
  const fileName = `${category}_${orderNumber || Date.now()}.html`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  log(`Saved ${category} print: ${filePath}`);
  return `/outputs/${fileName}`;
}

// ================= Routes =================
app.get('/api/health', (req,res) => res.json({ status:'online' }));

app.post('/api/print', (req,res) => {
  try {
    const { order, categoryDesigns } = req.body;

    if (!order || !categoryDesigns) {
      log('Invalid print request');
      return res.status(400).json({ ok:false, error:'Invalid print request' });
    }

    const result = {};
    for (const cat of Object.keys(categoryDesigns)) {
      const html = categoryDesigns[cat];
      if (!html) {
        result[cat] = 'EMPTY';
        continue;
      }
      savePrintFile(cat, html, order.orderNumber);
      result[cat] = 'SAVED';
    }

    res.json({ ok:true, status: result });
  } catch(err) {
    log(`Error: ${err.message}`);
    res.status(500).json({ ok:false, error: err.message });
  }
});

// ================= Start Server =================
app.listen(PORT, HOST, () => {
  const interfaces = os.networkInterfaces();
  let ip = 'localhost';
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) ip = iface.address;
    }
  }
  console.log(`Print server running at http://${ip}:${PORT}`);
});
