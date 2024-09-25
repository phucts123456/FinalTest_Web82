const movieModel = require("../models/movie");
const config = require("dotenv").config({ path: ".env" });
const constants = require("../utils/constants");
const cloudinary = require('cloudinary').v2;

const getMovie = async (req, res) => {
    const pageNumber = req.query.pn ? req.query.pn : 1;
    const limit = req.query.limit
    const pageSize = limit !== undefined ? limit : constants.CONST_MOVIE_PER_PAGE;
    const skip = (pageNumber - 1) * pageSize;
    let totalMovie = await movieModel.countDocuments();
    let totalItems = await movieModel.find().skip(skip).limit(pageSize).exec();
    const totalPage = Math.ceil(totalMovie / pageSize);
    const data = {
        totalItems: totalMovie,
        totalPage: totalPage,
        currentPage: pageNumber,
        items: totalItems
    }
    res.status(200).send({
        message: 'Get movie success',
        data: data
    })
}


const searchMovie = async (req, res) => {
    const searchKey = req.query.keyword;
    let searchModel = searchKey !== '' &&  searchKey !== undefined
        ? {name: { $regex: new RegExp(searchKey, "i") } , } 
        : {}
    let totalItems = await movieModel.find(searchModel).exec();
    res.status(200).send({
        message: 'Get movie success',
        data: totalItems
    })
}


const getDetail = async (req, res) => {
    const ID = req.params.ID;
    const isExistMovie = await movieModel.findOne({ID: ID}).exec(); 
    if (isExistMovie) {
        res.status(200).send({
            message: 'Get movie success',
            data: isExistMovie
        })
    } else {
        res.status(400).send({
            message: 'This movie is not available'
        })
    }
}



const createMovie = async (req, res) => {

    const { ID, name, time, year, introduce, image} = req.body;
    if (!ID || !name || !time || !year || !introduce) {
        return res.status(400).json({ error: 'Need to input ID,name,time,year,introduce.' });
    }

    const isMovieExist = await movieModel.findOne({ID: ID}).exec();
    if(!isMovieExist) {
        const newMovie = {
            ID: ID,
            name: name,
            time: time,
            year: year,
            introduce: introduce,
            image: image
        }
        await movieModel.create(newMovie);
        res.status(201).send({
            message: "Create movie success",
            data: newMovie
        })
    } else {
        res.status(400).send({
            message: "Create movie fail. This movies exist",
        })
    }
}

const updateMovie = async (req, res) => {

    const { ID, name, time, year, introduce} = req.body;
    if (!ID || !name || !time || !year || !introduce) {
        return res.status(400).json({ error: 'Need to input ID,name,time,year,introduce.' });
      }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file is uploaded.' });
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    cloudinary.uploader.upload(dataUrl, {
        resource_type: 'auto'
    }, async (err, result) => {
        if(result) {
            const isMovieExist = await movieModel.findOne({ID: ID}).exec();
            if(isMovieExist) {
                const updateMovie = {
                    ID: ID,
                    name: name,
                    time: time,
                    year: year,
                    introduce: introduce,
                    image: result.secure_url
                }
                await movieModel.findOneAndUpdate({ID: ID}, updateMovie);
                res.status(201).send({
                    message: "Update movie success.",
                    data: updateMovie
                })
            } else {
                res.status(400).send({
                    message: "Update movie fail. This movies not exist",
                })
            }
        }
        if (err) {
          res.status(400).json({
            message :"create movie fail. Upload image fail"
          });
        }
    })
}

const deleteMovie = async (req, res) => {
    try {
      const deletedmovie = await movieModel.findOneAndDelete({ID: req.params.ID});
      if (!deletedmovie) {
        return res.status(400).json({ message: "Can not find movie to delete." });
      }
      res.status(200).json({ message: "Delete movie success!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error:.", error: error.message });
    }
};

module.exports = {
    getMovie,
    searchMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    getDetail
}