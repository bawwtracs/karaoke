# karaoke
h5，K歌
javascript karaoke

## 使用(Vue3.x)
安装：
```
npm install karaoke
```
引入：
```
import Karaoke from 'karaoke-h5'
import 'karaoke-h5/lib/karaoke.css'
```
全局注册：
```
createApp(App).use(Karaoke)
```

## 属性
包含[recorder](https://github.com/2fps/recorder)属性
```
<Karaoke :options="options" />

option: {
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1, // 声道，支持 1 或 2， 默认是1
        tools: true, // 是否显示默认工具栏
        activeLyricClass: 'active', // 歌词当前进度行样式类
        wrapperStyle: `background: linear-gradient(to right bottom, rgb(232, 203, 192), rgb(99, 111, 164))`, // 录音页背景样式
        playingIndex: 0, // 正在播放的歌曲序号
        songs: [{ // 伴奏文件及歌曲封面
          name: '我爱我的祖国',
          artist: '佚名',
          url: 'https://xxx/1.mp3',
          cover: 'https://xxx/1.png'
        },
        {
          name: '妈妈教我一支歌',
          artist: '佚名',
          url: 'https://xxx/2.mp3',
          cover: 'https://xxx/2.png'
        }],
        lyricArrs: [ // 歌词数组
          [
            '[00:50.71] 你如仙境的村落',
            '[00:54.73] 你如星光的灯火',
            // ...
            '[04:04.33] 啊'
          ],
          [
            '[00:04.11] 妈妈教我一支歌 - 沈小岑',
            // ...
            '[00:08.37] 词：杨涌',
          ]
        ]
      }
```


## 传送门
* 录音机 [recorder](https://github.com/2fps/recorder)
* 音乐播放器 [APlayer](https://github.com/DIYgod/APlayer)
* 歌词定位 [lyric-parser](https://github.com/ustbhuangyi/lyric-parser)

## 任务列表
- [x] 录音
- [x] 歌词播放
- [x] 歌曲列表
- [x] 发布到npm
- [ ] 异步加载歌曲列表
- [ ] 歌曲评论点赞，播放弹幕
- [ ] 判断戴录音是否带耳机，同时播放录音和伴奏
- [ ] 配置使用缓存或者上传录音
