/**
 * dao层 movie数据库的CRUE
 * Created by mohong on 2016/10/18.
 */

'use strict';

//导入MySQL相关模块
const mysql = require('mysql');
const dbConfig = require('../../DB/DBConfig');
const movieSQL = require('../../DB/movieSQL');

//使用dbConfig创建一个连接池
const pool = mysql.createPool(dbConfig.mysql);

let moviedao = {
    addMovie: (post,title,rate,link) => {
        //从连接池中获取连接
        pool.getConnection((error,connection) => {
            if (error){
                throw error;
            } else {
                //建立连接，增加一个用户
                connection.query(movieSQL.insert,[post,title,rate,link],(error) => {
                    if (error){
                        throw error;
                    } else {
                        console.log('添加成功');
                    }
                    connection.release();
                })
            }
        })
    }
}

module.exports = moviedao;