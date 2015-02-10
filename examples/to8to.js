var Crawler = require("../lib/crawler");
var url = require('url');
var fs = require('fs');
var mkdirp = require('mkdirp');
var request = require("request");

//本地存储目录
var dir = './images';

//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

//下载方法
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};


var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        if(error) return;

        //console.log(result);
        $('img').each(function() {
            var src = $(this).attr('src');
            if (!src || src.length === 0) return; 
           
            urlRex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
            
            if (!urlRex.test(src)) return;
            console.log('正在下载' + src);

            //judge image extension name
            //some url may end with version control string , for examle:
            // 'http://pic.to8to.com/hotarea/xxxxx.jpg?1422675026' 

            download(src, dir, Math.floor(Math.random()*100000) + src.substr(-4,4));
            console.log('下载完成');
        });

        //parse links
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            c.queue(toQueueUrl);
        });
    }
});

// Queue just one URL, with default callback
c.queue('http://xiaoguotu.to8to.com/c10030018.html');

