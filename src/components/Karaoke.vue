<template>
  <div class="karaoke" :style="option.wrapperStyle">
    <Songs :class="{'hidden': !list, 'list': true}" :songs="option.songs" @playSong="playSong" />
    <div :class="{'hidden': list}" class="ui">
      <Recorder ref="recorder" :debug="debug" :option="option" @onplayend="onplayend" />
      <MusicPlayer v-show="!finish" ref="musicPlayer" :debug="debug" :music="option.songs[option.playingIndex]" @play="play" @pause="toggle" @end="end" />
      <LyricPlayer ref="lyricPlayer" :debug="debug" :lyric-arr="option.lyricArrs[option.playingIndex]" :active-lyric-class="option.activeLyricClass" :rows="12" />
    </div>
    <div v-if="!finish" class="hidden" :class="{'tools': option.tools && !list}">
      <van-button class="button" plain type="default" @click="showList">歌曲列表</van-button>
      <van-button class="button" plain type="default" :disabled="!recording" @click="stop">结束录制</van-button>
      <van-button class="button" plain type="default" :disabled="!recording" @click="replay">重录</van-button>
    </div>
    <div v-if="finish" class="hidden" :class="{'tools': option.tools && !list}">
      <van-button class="button" plain type="default" @click="showList">歌曲列表</van-button>
      <van-button class="button" plain type="default" @click="replay">重录</van-button>
      <van-button v-show="!playing" class="button" plain type="default" @click="playTheRecording">播放</van-button>
      <van-button v-show="playing" class="button" plain type="default" @click="pausePlayTheRecording">暂停</van-button>
      <van-button v-show="playing" class="button" plain type="default" @click="resumePlayTheRecording">继续</van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant'
import { Dialog } from 'vant'
import Songs from './Songs'
import Recorder from './Recorder'
import MusicPlayer from './MusicPlayer'
import LyricPlayer from './LyricPlayer'

export default {
  name: 'Karaoke',
  components: {
    [Button.name]: Button,
    Songs,
    Recorder,
    MusicPlayer,
    LyricPlayer
  },
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      recording: false,
      playing: false,
      finish: false,
      list: true,
      option: {
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1, // 声道，支持 1 或 2， 默认是1
        tools: true, // 是否显示默认工具栏
        activeLyricClass: 'active', // 歌词当前进度行样式类
        wrapperStyle: `background: linear-gradient(to right bottom, rgb(232, 203, 192), rgb(99, 111, 164))`, // 录音页背景样式,
        playingIndex: 0, // 正在播放的歌曲序号
        songs: [{ // 伴奏文件及歌曲封面
          name: '我爱我的祖国',
          artist: '佚名',
          url: 'https://yisoft.com.cn/inspection/karaoke/1.mp3',
          cover: 'https://yisoft.com.cn/inspection/karaoke/1.png'
          // lrc: 'https://yisoft.com.cn/inspection/karaoke/1.lrc'
        },
        {
          name: '妈妈教我一支歌',
          artist: '佚名',
          url: 'https://yisoft.com.cn/inspection/karaoke/2.mp3',
          cover: 'https://yisoft.com.cn/inspection/karaoke/2.png'
          // lrc: 'https://yisoft.com.cn/inspection/karaoke/2.lrc'
        }],
        lyricArrs: [ // 歌词数组
          [
            '[00:16.35] 啊啊啊',
            '[00:50.71] 你如仙境的村落',
            '[00:54.73] 你如星光的灯火',
            '[00:58.99] 如诗如画的是你',
            '[01:02.83] 是你万里的山河',
            '[01:07.77] 望江山的史册',
            '[01:11.95] 展人民的杰作',
            '[01:16.50] 方圆九州的沃土',
            '[01:20.51] 耕耘你新析传说',
            '[01:26.97] 我爱我的祖国',
            '[01:31.22] 我亲我的祖国',
            '[01:35.34] 亲你用我最暧的心窝',
            '[01:44.02] 我爱我的祖国',
            '[01:48.47] 我亲我的祖国',
            '[01:52.60] 爱你是我一生的寄托',
            '[02:18.65] 你如编制的阡陌',
            '[02:22.53] 你如瑶池的湖泊',
            '[02:27.18] 如情如梦的是你',
            '[02:30.75] 是你百姓的生活',
            '[02:35.64] 望创业的气魄',
            '[02:39.68] 展理想的收获',
            '[02:43.98] 男女老少的心中',
            '[02:48.28] 飞出你爱的恋歌',
            '[02:54.90] 我爱我的祖国',
            '[02:59.04] 我亲我的祖国',
            '[03:03.42] 亲你用我最暧的心窝',
            '[03:12.00] 我爱我的祖国',
            '[03:16.16] 我亲我的祖国',
            '[03:20.62] 爱你是我一生的寄托',
            '[03:29.14] 我爱我的祖国',
            '[03:33.41] 我亲我的祖国',
            '[03:37.58] 亲你用我最暧的心窝',
            '[03:46.25] 我爱我的祖国',
            '[03:50.25] 我亲我的祖国',
            '[03:54.93] 爱你是我一生的寄托',
            '[04:04.33] 啊'
          ],
          [
            '[00:04.11] 妈妈教我一支歌 - 沈小岑',
            '[00:08.37] 词：杨涌',
            '[00:12.66] 曲：刘虹',
            '[00:15.98] 妈妈教我一支歌',
            '[00:22.71] 没有共产党就没有新中国',
            '[00:29.10] 这支歌从妈妈心头飞出',
            '[00:35.93] 这支歌伴随她走遍祖国山河',
            '[00:46.46] 啊',
            '[00:53.24] 这支歌伴随她走遍祖国山河',
            '[01:13.96] 我唱妈妈教的歌',
            '[01:20.93] 没有共产党就没有新中国',
            '[01:27.62] 这支歌从我的心上飞起',
            '[01:34.46] 这支歌鼓舞我建设新生活',
            '[01:46.77] 我教儿女一支歌',
            '[01:51.70] 没有共产党就没有新中国',
            '[01:57.05] 这支歌飞进幼小心田',
            '[02:05.36] 这支歌世世代代永不落',
            '[02:18.17] 这支歌世世代代永不落',
            '[02:12.29] 这支歌世世代代永不落'
          ]
        ]
      }
    }
  },
  watch: {
    options: {
      handler(val) {
        this.option = Object.assign(this.option, val)
      },
      deep: true
    }
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {
    playSong(idx) {
      this.option.playingIndex = idx
      this.list = false
    },
    showList() {
      this.list = true
      this.pausePlayTheRecording()
      this.$refs.musicPlayer.pause()
      this.end()
      this.finish = false
    },
    play() {
      this.finish = false
      if (!this.recording) {
        this.$refs.recorder.start().then(() => {
          // console.log('record start')
          this.recording = true
          this.$refs.lyricPlayer.play()
        }, (error) => {
          console.log(error)
        })
      } else {
        this.toggle()
      }
    },
    toggle() {
      this.$refs.recorder.toggle()
      this.$refs.lyricPlayer.toggle()
    },
    end() {
      this.finish = true
      this.recording = false
      this.$refs.recorder.stop()
      this.$refs.lyricPlayer.stop()
    },
    stop() {
      this.$refs.musicPlayer.pause()
      const beforeClose = (action) =>
        new Promise((resolve) => {
          if (action === 'confirm') {
            this.finish = true
            resolve(true)
          } else {
            this.$refs.musicPlayer.resume()
            resolve(false)
          }
          Dialog.close()
        })

      Dialog.confirm({
        title: '结束录制',
        message: '确定要结束录制吗？',
        beforeClose
      })
    },
    replay() {
      this.$refs.musicPlayer.pause()
      const beforeClose = (action) =>
        new Promise((resolve) => {
          if (action === 'confirm') {
            this.end()
            this.$refs.musicPlayer.play()
            this.play()
            resolve(true)
          } else {
            this.$refs.musicPlayer.resume()
            resolve(false)
          }
          Dialog.close()
        })

      Dialog.confirm({
        title: '重新录制',
        message: '确定要重新录制吗？',
        beforeClose
      })
    },
    playTheRecording() {
      this.playing = true
      this.$refs.recorder.play()
      this.$refs.lyricPlayer.play()
    },
    pausePlayTheRecording() {
      this.$refs.recorder.pausePlay()
    },
    resumePlayTheRecording() {
      this.$refs.recorder.resumePlay()
    },
    onplayend() {
      // console.log('onplayend')
      this.playing = false
      this.$refs.lyricPlayer.stop()
    }
  }
}
</script>

<style lang="less" scoped>
.karaoke{
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;

  .list{
    flex-grow: 1;
  }

  .ui{
    flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-flow: column nowrap;
  }

  .hidden{
    display: none;
  }

  .tools{
    flex-grow: 0;
    display: flex;
    justify-content: center;
    padding: .5rem 0;
    .button{
      margin: 0 .2rem;
      border-radius: 15px;
      background: none;
      color: #fff;
    }
  }
}
</style>
