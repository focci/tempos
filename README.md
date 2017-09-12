# Tempos
Tempos is an efficient javascript template engine

## Install
```
npm install tempos --save
```
Or import the 'tempos.js' in the web page
```
<script src="./dist/tempos.js"></script>
```

## Usage
```
<div id="container"></div>
<script>
    const compile = Tempos('<div>Hello  {{= Name}}</div>');
    const res = compile({Name: "Tempos"});
    document.getElementById('container').innerHTML = res;
</script>
```

## Donation
![Wechat](https://raw.githubusercontent.com/focci/asset/master/pay/wechat.jpg)
&nbsp;&nbsp;&nbsp;&nbsp;
![Alipay](https://raw.githubusercontent.com/focci/asset/master/pay/alipay.jpg)