const { dbConf, dbQuery } = require('../config/database');
const { uploader } = require('../config/uploader');
const fs = require('fs');

module.exports = {
    getData: async (req, res, next) => {
        try {

            let filter = [];
            Object.keys(req.query).forEach(val => {
                filter.push(`${val}=${dbConf.escape(req.query[val])}`);
            })

            console.log(filter)
            console.log(`Select * FROM products 
            ${filter.length > 0 ? `WHERE ${filter.join(' AND ')};` : ''};`)
            let getProducts = await dbQuery(`Select * FROM products 
            ${filter.length > 0 ? `WHERE ${filter.join(' AND ')}` : ''};`);
            let getStocks = await dbQuery(`Select * FROM stocks;`);
            let getImages = await dbQuery(`Select * FROM images;`);

            getProducts.forEach(value => {
                value.stocks = [];
                value.images = [];

                getStocks.forEach(val => {
                    if (value.idproduct == val.idproduct) {
                        value.stocks.push(val)
                    }
                })

                getImages.forEach(val => {
                    if (value.idproduct == val.idproduct) {
                        value.images.push(val)
                    }
                })
            })

            return res.status(200).send(getProducts);
        } catch (error) {
            return next(error)
        }
    },
    addData: (req, res, next) => {
        if (req.dataUser.role == 'admin') {
            const uploadFile = uploader('/imgProduct', 'IMGPRO').array('images', 5);
            uploadFile(req, res, async (error) => {
                try {

                    console.log(req.body);
                    console.log('Pengecekan file :', req.files);

                    let { nama, brand, kategori, deskripsi, harga, stocks } = JSON.parse(req.body.data);

                    let insertProduct = await dbQuery(`INSERT INTO products (nama, brand, kategori, deskripsi, harga)
                        values (${dbConf.escape(nama)}, ${dbConf.escape(brand)}, ${dbConf.escape(kategori)}, 
                        ${dbConf.escape(deskripsi)}, ${dbConf.escape(harga)});`);

                    if (insertProduct.insertId) {
                        // add images
                        let imgData = req.files.map(val => {
                            return `(${dbConf.escape(insertProduct.insertId)},${dbConf.escape(`/imgProduct/${val.filename}`)})`;
                        })

                        await dbQuery(`INSERT INTO images (idproduct,urlImg) values ${imgData.join(',')};`)
                        // add stocks
                        let stocksData = stocks.map(val => {
                            return `(${dbConf.escape(insertProduct.insertId)},${dbConf.escape(val.type)},${dbConf.escape(val.qty)})`;
                        })
                        await dbQuery(`INSERT INTO stocks (idproduct,type,qty) values ${stocksData.join(',')};`)
                        return res.status(200).send({
                            success: true,
                            message: "Add product success ✅"
                        })
                    }

                } catch (error) {
                    req.files.forEach(val => fs.unlinkSync(`./public/imgProduct/${val.filename}`));
                    return next(error)
                }
            })
        } else {
            return res.status(401).send('You not authoriz for this feature');
        }
    },
}