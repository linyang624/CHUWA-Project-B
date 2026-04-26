export const previewDocument = async (req, res, next) => {
    res.json({ message: "Preview document" });
};

export const downloadDocument = async (req, res, next) => {
    res.json({ message: "Download document" });
};