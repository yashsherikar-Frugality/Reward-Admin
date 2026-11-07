// Defense in depth for untrusted workbooks: reject oversized files / absurd sheet counts
// before they reach the parser's callers.
(function () {
    if (!window.XLSX) return;
    const MAX_BYTES = 25 * 1024 * 1024, MAX_SHEETS = 60;
    const read = XLSX.read;
    XLSX.read = function (data, opts) {
        const n = data && (data.byteLength != null ? data.byteLength : data.length);
        if (n > MAX_BYTES) throw new Error('File is too large (max ' + (MAX_BYTES >> 20) + ' MB).');
        const wb = read.call(XLSX, data, opts);
        if (wb && wb.SheetNames && wb.SheetNames.length > MAX_SHEETS) throw new Error('Workbook has too many sheets.');
        return wb;
    };
})();
