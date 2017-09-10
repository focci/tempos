# Blast
高效的javascript模板引擎

# 安装
```
npm install blast --save
```
如果在web站点上使用，直接引入`blast.js`即可
```
<script src="./dist/blast.js"></script>
```

# 使用
```
<div id="container"></div>
<script>
    const compile = Blast('<div>Hello  {{= Name}}</div>');
    const res = compile({Name: "Blast"});
    document.getElementById('container').innerHTML = res;
</script>
```

# 参数 / 方法
## Blast.render(id:String, data:Object, option:Object)
Blast()的别名函数

| 参数    | 类型           | 说明  |
| ------- |:------------: | -----:|
| id   | String           | 模板ID |
| data   | Object           | 数据对象 |
| option   | Object       | 参数对象

## Blast.compile(id:String, option:Object)
编译模板，并返回一个函数

| 参数    | 类型           | 说明  |
| ------- |:------------: | -----:|
| id   | String           | 模板ID |
| option   | Object       | 参数对象

## Blast.Config
全局参数对象

| 参数    | 类型       | 说明  |
| ------- |:--------: | -----:|
| debug   | Boolean   | 调试模式，默认值true |
| cache   | Boolean   | 缓存，默认值true |
| startTag| String    | 表达式开始标记 |
| endTag| String      | 表达式结束标记 |
| extname| String     | 模板扩展名 |
| ignore| Object      | 编译模板时跳过的变量名

比如编译时要跳过一个变量名 `var`
```
Blast.Config['var'] = true;
```

## Blast.Filter
过滤器对象，用于自定义过滤器，比如我们现在要定义一个将字符转换为大写的过滤器
```
Blast.Filter.toUpperCase = (data) => {
    let ret = data;
    if( typeof data === 'string' ) {
        ret = data.toUpperCase();
    }
    return ret;
}
```
使用方式如下
```
{{= Name | toUpperCase}}
```

## Blast.Cache
缓存操作类
```
let ca = new Cache();
ca.set('blast', '高效的Javascript模板引擎');
console.log( ca.get('blast') );
```

| 方法    | 参数                             | 说明  |
| ------- |:------------------------------: | -----:|
| set   | (key:String, value:Any)           | 设置缓存 |
| get   | (key:String)                      | 缓存，默认值true |
| detail| (key:String, callback:Function)   | 查找key对应的缓存，如果没有则设置


# 捐赠
![微信](https://coding.net/u/focci/p/asset/git/raw/master/focci_wechat.jpg)
&nbsp;&nbsp;&nbsp;&nbsp;
![支付宝](https://coding.net/u/focci/p/asset/git/raw/master/focci_alipay.jpg)