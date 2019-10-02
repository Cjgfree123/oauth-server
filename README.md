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

* express-session: 先注册，再打印

  connect-mongo: 目前我代码存在问题

  权限列表,全选。

* 模板foreach返回DOM, 不用写return, 否则会被当成字符串, 渲染到页面上。

```
<!-- <%
permissions.forEach(function(item,){ %>
<li class="list-group-item">
    <div class="checkbox">
        <label for="">
            <input type="checkbox" value="<%=item._id%>" /><%=name%>
        </label>
    </div>
</li>
<%})
%> -->
```

* express 语法
    * 语句的每一行,格式 <% 语句 %>
    * res.render("模板名", { data }) // 没有传入的对象，拒绝直接渲染
    * 不要在模板中, 随便注释, 否则解读到括号会直接进行报错。

## 目前进度

注册session有问题