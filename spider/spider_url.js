/**
 * 根据标签爬取电影的url
 * Created by mohong on 2016/11/18.
 */

var request = require('request');
var fs = require('fs');
var async = require('async');
var ParseUrl = require('./parse_url');

var timer = null;
var tag_index = 0;

//读取标签文件

var path = __dirname+'/../data/movie/tag.txt';
fs.readFile(path,'utf8',function (err,data) {
    if (err){
        throw err;
    }else {
        var tags = data.split(',');

        var timer2 = setInterval(function () {
            var tag = tags[tag_index];
            pingurl(tag);
            //console.log(tag);

            if (tag_index == tags.length){
                clearInterval(timer2);
            }
        },2000);
    }
});



function pingurl(tag) {
    var page = 0;
    timer = setInterval(function () {
        var url = 'https://movie.douban.com/tag/'+encodeURI(tag)+'?start='+page*20+'&type=T';
        console.log(url);
        parseurl(url);
        page ++;
    },1000);
}


//给一个url，解析当前页的电影详情url，能得到20个电影url
function parseurl(url) {
    request(url,function (err,response,body) {
        if (!err && response.statusCode == 200){
            ParseUrl(body,saveUrl);
        }
    });
}

//把url写入url文本文件
function saveUrl(urls,data) {
    var path = __dirname+'/../data/movie/url.txt';
    if (urls != []){
        fs.appendFile(path,data,'utf8',function (err) {
            if (err){
                throw err;
            }else {
                console.log('写入成功~');
            }
        });
    }else {
        tag_index ++;
        clearInterval(timer);
    }
}