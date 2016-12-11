# douban
基于豆瓣电影的数据分析系统

## 源数据
电影数据均来源于[豆瓣电影](https://movie.douban.com/)，仅供个人学习使用。通过nodejs爬虫爬取电影信息。

### 爬虫依赖的包
- [request](https://www.npmjs.com/package/request)
- [cheerio](https://www.npmjs.com/package/cheerio)
 
通过request可以发送http请求，获取请求到页面的body，cheerio可以实现像操作jQuery一样操作请求到的页面数据。
### 爬虫设计
经过长期研究，发现通过标签获取电影是最有效的爬取电影的方法。爬虫依次要完成的任务有：
- 通过[标签页](https://movie.douban.com/tag/)爬取所有标签,得到标签数组A
- 遍历标签数组A，每5S（实践发现间隔小于5S的连续方法很容易被封号）发送一次请求，爬取每个标签对应的总页数，数据结构设计为对象，保存至数组B中
- 遍历存放对象的数组B,得到每个标签的每一页的url
- 根据页码url，发送请求爬取每个页码url对应页面列表中所有电影的url（除最后一页外，其他均每页20个），存入数组C
- 遍历上面的数组C，存入全局数组D
- 遍历全局数组D，每5S发送一次请求，获取详情。
- 解析详情页，将数据保存至mongodb数据库

### 项目难点
由于node异步的特点，且访问豆瓣的频率限制（大概实现每5s发送一次请求，能避免封号），所以要控制好访问平率。解决的思路是给需要执行的任务设置一个setInterval定时器，然后设置一个toggle和全局计数器，当第一个任务完成后，清除定时器，同时设置toggle为true，当toggle为true时，且第二个任务的定时器又一次执行的时候，第二个任务开始执行，开始维护全局计数器，以此类推。最后完成的效果是：启动爬虫后，访问频率大约5s，获取电影数据，然后持久化。