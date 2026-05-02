---
title: 开发团队 - PixivSource Pixiv 书源项目成员
description: PixivSource 项目开发团队介绍：核心开发者、站方协助与社区贡献者名单。
comment: false
aside: false
head:
  - - meta
    - name: keywords
      content: PixivSource开发团队, Pixiv书源作者, DowneyRem, PixivSource贡献者
  - - meta
    - property: og:title
      content: 开发团队 - PixivSource Pixiv 书源项目成员
  - - meta
    - property: og:description
      content: PixivSource 项目开发团队介绍：核心开发者、站方协助与社区贡献者名单。
---

<script setup>
// 动态设置博客网址
import { useData } from 'vitepress';
const { site } = useData();
const isCF = site.value.base === "/";
const BLOG = isCF ? 'https://downeyrem.pages.dev' : 'https://downeyrem.github.io'

import { VPTeamPage, VPTeamPageTitle, VPTeamMembers} from "vitepress/theme";

const members = [
    {
        avatar: "https://www.github.com/DowneyRem.png",
        name: "DowneyRem",
        title: "唐尼瑞姆",
        desc: "项目创始、主要维护",
        actionText: "打赏",
        sponsor: "/Sponsor",
        links: [
            { icon: "vitepress", link: BLOG },
            { icon: "github", link: "https://github.com/DowneyRem" },
        ]
    },
    {
        avatar: "https://www.github.com/windyhusky.png",
        name: "WindyHusky",
        title: "狗子",
        desc: "早期开发",
        links: [
            { icon: "github", link: "https://github.com/windyhusky" },
        ]
    },

    {
        avatar: "https://www.github.com/eigeen.png",
        name: "Eigeen",
        title: "本征",
        desc: "TypeScript 重构",
        links: [
            { icon: "github", link: "https://github.com/eigeen" },
        ]
    },
];

const supportor = [
    {
        avatar: "https://www.github.com/libudu.png",
        name: "Linpicio",
        title: "林彼丢",
        desc: "Linpx 前站长",
        links: [
            { icon: "github", link: "https://github.com/libudu" },
        ]
    },
    {
        avatar: "https://cravatar.com/avatar/1f950bb98467b977c546a3acd0f4b6df?size=256",
        name: "k99k5",
        title: "KK",
        desc: "FurryNovel 前站长",
        org: "绒兽志",
        orgLink: "https://fursuit.cool",
        links: [
            { icon: "github", link: "https://github.com/k99k5" },
            { icon: {
                svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="300px" height="300px" viewBox="50 50 200 200" enable-background="new 0 0 300 300" xml:space="preserve">  <image id="image0" width="300" height="300" x="0" y="0" xlink:href="data:image/png;base64,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"/></svg>'
              }, link: "https://fursuit.cool", ariaLabel: '绒兽志'},
        ]
    },
];

const partners = [
    {
        avatar: "https://github.com/Luoyacheng.png",
        name: "Luoyacheng",
        title: "洛娅橙",
        desc: "",
        links: [
            { icon: "github", link: "https://github.com/Luoyacheng" },
        ]
    },
    {
        avatar: "https://github.com/HundSimon.png",
        name: "Melaton",
        title: "梅拉顿",
        desc: "",
        links: [
            { icon: "github", link: "https://github.com/HundSimon" },
        ]
    },
];
</script>

<VPTeamPage>
    <VPTeamPageSection>
        <VPTeamPageTitle>
            <template #title> 开发团队 </template>
            <template #lead>
                Pixiv 书源项目 开发团队
            </template>
        </VPTeamPageTitle>
        <VPTeamMembers size="small" :members="members"/>
    </VPTeamPageSection>
    <VPTeamPageSection>
        <VPTeamPageTitle>
            <template #title> 站方协助 </template>
        </VPTeamPageTitle>
        <VPTeamMembers size="small" :members="supportor"/>
    </VPTeamPageSection>
    <VPTeamPageSection>
        <VPTeamPageTitle>
            <template #title> 社区帮助 </template>
        </VPTeamPageTitle>
        <VPTeamMembers size="small" :members="partners"/>
    </VPTeamPageSection>
</VPTeamPage>

