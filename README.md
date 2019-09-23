# oauth-server
qq登录

## 备份

header.html (模板)
```
<!-- <%
if(user){%>
    <li>
    <a href="/user/signout">退出</a>
    </li>
    <li>
    <a href="/oauth2.0/application">创建应用</a>
    </li>
<%}else{%>
    <li>
    <a href="/user/signup">注册</a>
    </li>
    <li>
    <a href="/user/signin">登录</a>
    </li>
<%}
%> -->
```

## 注意

express-session: 先注册，再打印

## 目前进度

注册session有问题