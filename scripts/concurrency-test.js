const startTime = Date.now();
const totalRequests = 1000;
const promises = [];

console.log(`Starting concurrency test: firing ${totalRequests} simultaneous requests to http://localhost:3000...`);

for (let i = 0; i < totalRequests; i++) {
    promises.push(
        fetch('http://localhost:3000')
            .then(res => {
                if (res.ok) return { success: true };
                return { success: false, status: res.status };
            })
            .catch(err => {
                return { success: false, error: err.message };
            })
    );
}

Promise.all(promises).then(results => {
    const duration = Date.now() - startTime;
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const errors = results.filter(r => r.error);
    
    console.log(`\n=== STRESS TEST RESULTS ===`);
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Throughput: ${(totalRequests / (duration / 1000)).toFixed(2)} requests/sec`);
    if (errors.length > 0) {
        console.log(`Sample Errors:`, [...new Set(errors.map(e => e.error))].slice(0, 5));
    }
    console.log(`===========================\n`);
});
