const express = require('express');
const cors = require('cors');
const printer = require('node-printer'); // 👈 The library that interacts with OS printing
const app = express();
const PORT = 3000;

// --- CORS Configuration ---
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- DEBUG: Log what methods the 'printer' object contains ---
// RUN THIS AND CHECK YOUR CONSOLE FOR THE CORRECT FUNCTION NAME!
console.log('🔍 Available printer methods:', Object.keys(printer));
// ------------------------------------------------------------


// --- Helper function for ACTUAL printing (Using printDirect as assumed) ---
function sendToPrinter(printerName, data) {
    console.log(`\n--- Attempting Print Job on: ${printerName} ---`);
    let printContent = `
*****************************************
Order Manifest - ${data.date}
Order ID: ${data.orderId}
Customer: ${data.customer}

--- Items ---
`;
    data.items.forEach(item => {
        printContent += `SKU: ${item.sku} | Qty: ${item.qty} | Name: ${item.name}\n`;
    });
    printContent += `*****************************************`;

    try {
        // **ACTION NEEDED:** If the DEBUG line shows a different function name (e.g., 'print'),
        // change 'printer.printDirect' below to 'printer.print'.
        printer.printDirect({
            data: printContent,        
            printer: printerName,      
            type: 'RAW',              
            success: function(jobId) {
                console.log(`✅ Print job to ${printerName} successful. Job ID: ${jobId}`);
            },
            error: function(err) {
                console.error(`❌ Error printing to ${printerName}:`, err);
            }
        });
        return true;
    } catch(e) {
        console.error(`❌ Printer library exception for ${printerName}: ${e.message}`);
        return false;
    }
}


// --- Main Print API Endpoint ---
app.post('/print-order', (req, res) => {
    const { printers, orderData } = req.body;

    if (!printers || !orderData) {
        return res.status(400).json({ status: 'Error', message: 'Missing printer list or order data.' });
    }

    console.log(`\n--- Received Print Request for Order: ${orderData.orderId} ---`);

    let jobsSubmitted = 0;
    printers.forEach(printerName => {
        if (sendToPrinter(printerName, orderData)) {
            jobsSubmitted++;
        }
    });

    if (jobsSubmitted > 0) {
        res.json({
            status: 'Success',
            message: `Print command issued successfully to ${jobsSubmitted} of ${printers.length} printers.`
        });
    } else {
        res.status(500).json({
            status: 'Error',
            message: 'Print library failed to initiate any print jobs. Check server logs for exceptions and verify printer names/installation.'
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`\nLocal Print Service running at http://localhost:${PORT}`);
    console.log(`Waiting for requests from your Angular application...`);
});
