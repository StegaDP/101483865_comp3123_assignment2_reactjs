const {Router} = require("express");
const {mongoose, Types} = require("mongoose");
const Employee = require("../models/Employee");
const multer = require("multer");
const imgRouter = Router();


let gfsBucket;

mongoose.connection.once("open", () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "images",
    });
    console.log("GridFSBucket ready");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


imgRouter.get("/:id", async (req, res) => {
    try {
        const fileId = new Types.ObjectId(req.params.id);

        const downloadStream = gfsBucket.openDownloadStream(fileId);

        downloadStream.on("file", (file) => {
            if (file.contentType) {
                res.set("Content-Type", file.contentType);
            }
        });

        downloadStream.on("error", () => {
            res.status(404).json({ error: "File not found" });
        });

        downloadStream.pipe(res);
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: "Invalid id" });
    }
});


imgRouter.post("/:id", upload.single("image"), async (req, res) => {
    try {
        const employeeId = req.params.id;
        const fileBuffer = req.file.buffer;
        const filename = req.file.originalname || "image";

        const uploadStream = gfsBucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
        });

        uploadStream.on("error", (err) => {
            console.error(err);
            res.status(500).json({ error: "Error uploading file" });
        });

        uploadStream.on("finish", async () => {
            const fileId = uploadStream.id;
            await Employee.findByIdAndUpdate(employeeId, { imageId: fileId });
            res.json({ status: "ok", imageId: fileId });
        });

        uploadStream.end(fileBuffer);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = imgRouter;