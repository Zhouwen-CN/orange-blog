import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as e,c as t,d as i,a as n,e as s,f as l}from"./app-rZy3cJ8G.js";const c={},r=n("h1",{id:"kerberos-入门",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#kerberos-入门"},[n("span",null,"Kerberos 入门")])],-1),o=n("p",null,[s("🏆 "),n("code",null,"Kerberos"),s(" 主要用来做网络通讯中的身份认证，帮助我们高效，安全的识别访问者")],-1),p=l(`<div class="hint-container info"><p class="hint-container-title">相关信息</p><p>kerberos 协议存在的组成：</p><ol><li><code>客户端</code>（Client）：发送请求的一方</li><li><code>服务端</code>（Server）：接收请求的一方</li><li><code>密钥分发中心</code>（Key distribution KDC）</li></ol></div><figure><img src="https://gitee.com/Zhouwen-CN/orange-blog-pictures/raw/master/images/202404032105528.png" alt="kerberos角色流程图" tabindex="0" loading="lazy"><figcaption>kerberos角色流程图</figcaption></figure><h2 id="_1-安装" tabindex="-1"><a class="header-anchor" href="#_1-安装"><span>1 安装</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment">#服务端</span>
yum <span class="token function">install</span> krb5-libs krb5-server krb5-workstation
<span class="token comment">#客户端</span>
yum <span class="token function">install</span> krb5-libs krb5-workstation
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-编辑配置文件" tabindex="-1"><a class="header-anchor" href="#_2-编辑配置文件"><span>2 编辑配置文件</span></a></h2><h3 id="_2-1-修改-kdc-conf-server" tabindex="-1"><a class="header-anchor" href="#_2-1-修改-kdc-conf-server"><span>2.1 修改 kdc.conf（server）</span></a></h3><p>修改 <code>/var/kerberos/krb5kdc/kdc.conf</code> 文件</p><div class="language-toml line-numbers-mode" data-ext="toml" data-title="/var/kerberos/krb5kdc/kdc.conf"><pre class="language-toml"><code><span class="token punctuation">[</span><span class="token table class-name">kdcdefaults</span><span class="token punctuation">]</span>
<span class="token key property">kdc_ports</span> <span class="token punctuation">=</span> <span class="token number">88</span>
<span class="token key property">kdc_tcp_ports</span> <span class="token punctuation">=</span> <span class="token number">88</span>

<span class="token punctuation">[</span><span class="token table class-name">realms</span><span class="token punctuation">]</span>
<span class="token key property">HADOOP.COM</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
  <span class="token comment"># master_key_type = aes256-cts</span>
  <span class="token comment"># admin 用户权限</span>
  <span class="token key property">acl_file</span> <span class="token punctuation">=</span> /var/kerberos/krb5kdc/kadm5<span class="token punctuation">.</span>acl
  <span class="token key property">dict_file</span> <span class="token punctuation">=</span> /usr/share/dict/words
  <span class="token comment"># kdc进行检验的keytab</span>
  <span class="token key property">admin_keytab</span> <span class="token punctuation">=</span> /var/kerberos/krb5kdc/kadm5<span class="token punctuation">.</span>keytab
  <span class="token comment"># 支持的检验方式</span>
  <span class="token key property">supported_enctypes</span> <span class="token punctuation">=</span> aes128-cts:normal des3-hmac-sha1:normal arcfour-hmac:normal camellia256-cts:normal camellia128-cts:normal des-hmac-sha1:normal des-cbc-md5:normal des-cbc-crc:normal
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-修改-krb5-conf-server-and-client" tabindex="-1"><a class="header-anchor" href="#_2-2-修改-krb5-conf-server-and-client"><span>2.2 修改 krb5.conf（server and client）</span></a></h3><p>修改 <code>/etc/krb5.conf</code> 文件</p><div class="language-toml line-numbers-mode" data-ext="toml" data-title="/etc/krb5.conf"><pre class="language-toml"><code><span class="token comment"># Configuration snippets may be placed in this directory as well</span>
includedir /etc/krb5<span class="token punctuation">.</span>conf<span class="token punctuation">.</span>d/

<span class="token punctuation">[</span><span class="token table class-name">logging</span><span class="token punctuation">]</span>
<span class="token key property">default</span> <span class="token punctuation">=</span> FILE:/var/log/krb5libs<span class="token punctuation">.</span>log
<span class="token key property">kdc</span> <span class="token punctuation">=</span> FILE:/var/log/krb5kdc<span class="token punctuation">.</span>log
<span class="token key property">admin_server</span> <span class="token punctuation">=</span> FILE:/var/log/kadmind<span class="token punctuation">.</span>log

<span class="token punctuation">[</span><span class="token table class-name">libdefaults</span><span class="token punctuation">]</span>
<span class="token key property">dns_lookup_realm</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
<span class="token comment"># 票据存在时间</span>
<span class="token key property">ticket_lifetime</span> <span class="token punctuation">=</span> 24h
<span class="token comment"># 最大延长时间</span>
<span class="token key property">renew_lifetime</span> <span class="token punctuation">=</span> 7d
<span class="token key property">forwardable</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token key property">rdns</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
<span class="token key property">pkinit_anchors</span> <span class="token punctuation">=</span> FILE:/etc/pki/tls/certs/ca-bundle<span class="token punctuation">.</span>crt
<span class="token comment"># 默认域</span>
<span class="token key property">default_realm</span> <span class="token punctuation">=</span> HADOOP<span class="token punctuation">.</span>COM
<span class="token key property">default_ccache_name</span> <span class="token punctuation">=</span> KEYRING:persistent:%<span class="token punctuation">{</span>uid<span class="token punctuation">}</span>
<span class="token comment"># 禁止使用udp</span>
<span class="token key property">udp_preference_limit</span> <span class="token punctuation">=</span> <span class="token number">1</span>

<span class="token punctuation">[</span><span class="token table class-name">realms</span><span class="token punctuation">]</span>
<span class="token key property">HADOOP.COM</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
  <span class="token comment"># kdc服务地址</span>
  <span class="token key property">kdc</span> <span class="token punctuation">=</span> hadoop101
  <span class="token comment"># admin server服务地址</span>
  <span class="token key property">admin_server</span> <span class="token punctuation">=</span> hadoop101
<span class="token punctuation">}</span>

<span class="token punctuation">[</span><span class="token table class-name">domain_realm</span><span class="token punctuation">]</span>
<span class="token punctuation">.</span>example<span class="token punctuation">.</span>com <span class="token punctuation">=</span> HADOOP<span class="token punctuation">.</span>COM
<span class="token key property">example.com</span> <span class="token punctuation">=</span> HADOOP<span class="token punctuation">.</span>COM
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-生成-kerberos-数据库" tabindex="-1"><a class="header-anchor" href="#_3-生成-kerberos-数据库"><span>3 生成 kerberos 数据库</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>kdb5_util create <span class="token parameter variable">-s</span>
<span class="token comment"># 输入密码</span>
Enter KDC database master key:
Re-enter KDC database master key to verify:
<span class="token comment"># 查看路径下是否生成以下文件</span>
<span class="token comment"># kadm5.acl  kdc.conf  principal  principal.kadm5  principal.kadm5.lock  principal.ok</span>
<span class="token function">ls</span> /var/kerberos/krb5kdc/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-创建管理员主体-实例" tabindex="-1"><a class="header-anchor" href="#_4-创建管理员主体-实例"><span>4 创建管理员主体/实例</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;addprinc admin/admin&quot;</span>
<span class="token comment"># 输入密码</span>
Enter KDC database master key:
Re-enter KDC database master key to verify:
<span class="token comment"># 给管理员实例的所有主体授权</span>
<span class="token function">vim</span> /var/kerberos/krb5kdc/kadm5.acl
<span class="token comment"># 替换内容</span>
*/admin@HADOOP.COM      *
<span class="token comment"># 前面的*代表所有主体，后面的*代表所有权限</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-启动服务-server" tabindex="-1"><a class="header-anchor" href="#_5-启动服务-server"><span>5 启动服务（server）</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>systemctl start kadmin
systemctl <span class="token builtin class-name">enable</span> kadmin
systemctl start krb5kdc
systemctl <span class="token builtin class-name">enable</span> krb5kdc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-创建普通主体-实例" tabindex="-1"><a class="header-anchor" href="#_6-创建普通主体-实例"><span>6 创建普通主体/实例</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;addprinc atguigu&quot;</span>
<span class="token comment"># 输入密码</span>
Enter password <span class="token keyword">for</span> principal <span class="token string">&quot;atguigu@HADOOP.COM&quot;</span><span class="token builtin class-name">:</span>
Re-enter password <span class="token keyword">for</span> principal <span class="token string">&quot;atguigu@HADOOP.COM&quot;</span><span class="token builtin class-name">:</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h2><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment"># 认证</span>
kinit admin/admin
<span class="token comment"># 查看认证</span>
klist
<span class="token comment"># 登入shell-server，输入?提示</span>
kadmin.local
<span class="token comment"># 登入shell-client，输入?提示</span>
kadmin
<span class="token comment"># 创建主体/实例</span>
kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;addprinc atguigu&quot;</span>
<span class="token comment"># 修改主体/实例密码</span>
kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;cpw atguigu&quot;</span>
<span class="token comment"># 查看所有主体/实例</span>
kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;list_principals&quot;</span>
<span class="token comment"># 生成keytab，当生成keytab之后，使用密码将不能再登入</span>
kadmin.local <span class="token parameter variable">-q</span> <span class="token string">&quot;ktadd -k /root/atguigu.keytab atguigu&quot;</span>
<span class="token comment"># 使用keytab进行认证</span>
kinit <span class="token parameter variable">-kt</span> /root/atguigu.keytab atguigu
<span class="token comment"># 销毁凭证，提示有缓存，使用-A参数清空所有</span>
kdestroy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21);function d(u,m){return e(),t("div",null,[r,o,i(" more "),p])}const b=a(c,[["render",d],["__file","kerberos入门.html.vue"]]),h=JSON.parse('{"path":"/bigdata/kerberos%E5%85%A5%E9%97%A8.html","title":"Kerberos入门","lang":"zh-CN","frontmatter":{"title":"Kerberos入门","icon":"fa-solid fa-dog","date":"2024-04-03T00:00:00.000Z","star":true,"category":["大数据"],"tag":["kerberos"],"description":"🏆 Kerberos 主要用来做网络通讯中的身份认证，帮助我们高效，安全的识别访问者","head":[["meta",{"property":"og:url","content":"https://zhouwen-cn.gitee.io/orange-blog/bigdata/kerberos%E5%85%A5%E9%97%A8.html"}],["meta",{"property":"og:site_name","content":"橙子博客"}],["meta",{"property":"og:title","content":"Kerberos入门"}],["meta",{"property":"og:description","content":"🏆 Kerberos 主要用来做网络通讯中的身份认证，帮助我们高效，安全的识别访问者"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://gitee.com/Zhouwen-CN/orange-blog-pictures/raw/master/images/202404032105528.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-27T14:52:05.000Z"}],["meta",{"property":"article:author","content":"Mr.陈"}],["meta",{"property":"article:tag","content":"kerberos"}],["meta",{"property":"article:published_time","content":"2024-04-03T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-27T14:52:05.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Kerberos入门\\",\\"image\\":[\\"https://gitee.com/Zhouwen-CN/orange-blog-pictures/raw/master/images/202404032105528.png\\"],\\"datePublished\\":\\"2024-04-03T00:00:00.000Z\\",\\"dateModified\\":\\"2024-04-27T14:52:05.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.陈\\",\\"url\\":\\"https://gitee.com/Zhouwen-CN\\",\\"email\\":\\"597879949@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"1 安装","slug":"_1-安装","link":"#_1-安装","children":[]},{"level":2,"title":"2 编辑配置文件","slug":"_2-编辑配置文件","link":"#_2-编辑配置文件","children":[{"level":3,"title":"2.1 修改 kdc.conf（server）","slug":"_2-1-修改-kdc-conf-server","link":"#_2-1-修改-kdc-conf-server","children":[]},{"level":3,"title":"2.2 修改 krb5.conf（server and client）","slug":"_2-2-修改-krb5-conf-server-and-client","link":"#_2-2-修改-krb5-conf-server-and-client","children":[]}]},{"level":2,"title":"3 生成 kerberos 数据库","slug":"_3-生成-kerberos-数据库","link":"#_3-生成-kerberos-数据库","children":[]},{"level":2,"title":"4 创建管理员主体/实例","slug":"_4-创建管理员主体-实例","link":"#_4-创建管理员主体-实例","children":[]},{"level":2,"title":"5 启动服务（server）","slug":"_5-启动服务-server","link":"#_5-启动服务-server","children":[]},{"level":2,"title":"6 创建普通主体/实例","slug":"_6-创建普通主体-实例","link":"#_6-创建普通主体-实例","children":[]},{"level":2,"title":"常用命令","slug":"常用命令","link":"#常用命令","children":[]}],"git":{"createdTime":1714229525000,"updatedTime":1714229525000,"contributors":[{"name":"Zhouwen-CN","email":"597879949@qq.com","commits":1}]},"readingTime":{"minutes":2.04,"words":612},"filePathRelative":"bigdata/kerberos入门.md","localizedDate":"2024年4月3日","excerpt":"\\n<p>🏆 <code>Kerberos</code> 主要用来做网络通讯中的身份认证，帮助我们高效，安全的识别访问者</p>\\n","autoDesc":true}');export{b as comp,h as data};
