module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `psets` ORDER BY id ASC"; // query database to get all the psets

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Generated PSets"
                ,psets: result
            });
        });
    },
};