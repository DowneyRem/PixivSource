## 🍖 [投喂作者](Sponsor.md#Sponsor) {#Sponsor}
<DragonChat name="唐尼瑞姆" icon="🐲">

<strong>如果书源帮到了你，欢迎投喂本龙</strong><br>
<strong>你的鼓励是持续更新的动力～</strong>
<div class="quote-area">
你将获得：<br>
· <strong>加入书源反馈群</strong><br>
· <strong>赞助书源的上游开发者</strong><br>
· <strong>解锁部分幕后开发内容</strong><br>
· <strong>新功能意见优先反馈权</strong><br>
</div>
</DragonChat>


<div v-if="pagePath === 'Sponsor'">
  <Sponsor/>
</div>

<div v-else-if="pagePath === 'en/Sponsor'">
<Sponsor 
:links="[
{ text: 'GitHub Sponsors', icon: '🐙', url: 'https://github.com/sponsors/DowneyRem', color: '#000000' },
{ text: 'Buy me a Coffee', icon: '☕️', url: 'https://ko-fi.com/downeyrem', color: '#ff5f5f' },
]"
/>
</div>

<div v-else>
  <Sponsor :qrs="[]"/>
</div>


> [!IMPORTANT]
> **投喂时，可在【留言】中留下【书源】和【你的ID/昵称】**

> [!TIP]
> **如果暂时没有投喂的打算，可以去 [GitHub 仓库](https://github.com/DowneyRem/PixivSource) 帮本龙点个 ⭐️ Star**
