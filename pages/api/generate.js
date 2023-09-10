var fs = require("fs");
var ejs = require("ejs");
var pdf = require("html-pdf");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const { title } = req.body;
  switch (method) {
    case "GET":
      var compiled = ejs.compile(fs.readFileSync(process.cwd() + "/public/pdf.html", "utf8"));
      var html = compiled({ address1: "bangkok", state1: "TH", invoiceNo: "123445590" });

      //   pdf.create(html, { format: "a4" }).toFile("./download.pdf", function (err, response) {
      //     if (err) return console.log(err);
      //     res.send(response);
      //   });
      pdf.create(html).toBuffer(function (err, buffer) {
        if (err) return console.log(err);
        const data = Buffer.from(buffer);
        res.setHeader("Content-disposition", 'inline; filename="test.pdf"');
        res.setHeader("Content-type", "application/pdf");

        res.status(200).send(data);
      });
      break;

    case "PUT":
      res.status(200).json({ id, title: title || `Post #${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
