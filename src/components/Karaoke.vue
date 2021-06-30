<template>
  <div class="karaoke" :style="option.wrapperStyle">
    <Songs :class="{'hidden': !list, 'list': true}" :songs="option.songs" @playSong="playSong" />
    <div :class="{'hidden': list}" class="ui">
      <Recorder ref="recorder" :debug="debug" :option="option" @onplayend="onplayend" />
      <LyricPlayer ref="lyricPlayer" :debug="debug" :lyric-arr="option.lyricArrs[option.playingIndex]" :active-lyric-class="option.activeLyricClass" :rows="12" />
      <MusicPlayer v-show="!finish" ref="musicPlayer" :debug="debug" :music="option.songs[option.playingIndex]" @play="play" @pause="toggle" @end="end" />
      <div v-show="finish" class="song-desc">
        <van-image round class="thumb" :src="option.songs[option.playingIndex].cover" :fit="'fill'" />
        <div class="name">{{ option.songs[option.playingIndex].name }}</div>
      </div>
    </div>
    <div v-if="!finish" class="hidden" :class="{'tools': option.tools && !list}">
      <div class="button" plain type="default" @click="showList">
        <van-icon name="orders-o" />
        <div>列表</div>
      </div>
      <div class="button" plain type="default" :disabled="!recording" @click="stop">
        <van-icon name="stop-circle-o" />
        <div>结束</div>
      </div>
      <div class="button" plain type="default" :disabled="!recording" @click="replay">
        <van-icon name="replay" />
        <div>重唱</div>
      </div>
    </div>
    <div v-if="finish" class="hidden" :class="{'tools': option.tools && !list}">
      <div class="button" plain type="default" @click="showList">
        <van-icon name="orders-o" />
        <div>列表</div>
      </div>
      <div class="button" plain type="default" @click="replay1">
        <van-icon name="replay" />
        <div>重唱</div>
      </div>
      <div v-show="!playing" class="button" plain type="default" @click="playTheRecording">
        <van-icon name="play-circle-o" />
        <div>播放</div>
      </div>
      <div v-show="playing" class="button" plain type="default" @click="resumePlayTheRecording">
        <van-icon name="play-circle-o" />
        <div>播放</div>
      </div>
      <div v-show="playing" class="button" plain type="default" @click="pausePlayTheRecording">
        <van-icon name="pause-circle-o" />
        <div>暂停</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
import { Image } from 'vant'
import { Dialog } from 'vant'
import Songs from './Songs'
import Recorder from './Recorder'
import MusicPlayer from './MusicPlayer'
import LyricPlayer from './LyricPlayer'

export default {
  name: 'Karaoke',
  components: {
    [Icon.name]: Icon,
    [Image.name]: Image,
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
        },
        {
          name: '妈妈教我一支歌',
          artist: '佚名',
          url: 'https://yisoft.com.cn/inspection/karaoke/2.mp3',
          cover: 'https://yisoft.com.cn/inspection/karaoke/2.png'
        }],
        lyricArrs: [ // 歌词数组
          [
            '[00:16.35] 啊啊啊',
            '[04:04.33] 啊'
          ],
          [
            '[00:04.11] 妈妈教我一支歌 - 沈小岑',
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
    this.option = Object.assign(this.option, this.options)
  },
  beforeUnmount() {
  },
  methods: {
    playSong(idx) {
      this.option.playingIndex = idx
      this.list = false
      this.$emit('play')
    },
    showList() {
      this.list = true
      this.pausePlayTheRecording()
      this.$refs.musicPlayer.pause()
      this.end()
      this.finish = false
      this.$emit('list')
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
    replay1() {
      if (this.playing) {
        this.pausePlayTheRecording()
      }
      const beforeClose = (action) =>
        new Promise((resolve) => {
          if (action === 'confirm') {
            this.end()
            this.$refs.musicPlayer.play()
            this.play()
            resolve(true)
          } else {
            if (this.playing) {
              this.resumePlayTheRecording()
            }
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

  .song-desc{
    background: #fff;
    border-radius: 7px;
    width: 90%;
    height: 66px;
    margin-left: 5%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .thumb{
      margin: 0 20px 0 10px;
      flex-shrink: 0;
      height: 55px;
      width: 55px;
    }
    .name{
      flex-grow: 1;
      text-align: left;
      font-weight: bold;
    }
  }

  .tools{
    flex-grow: 0;
    display: flex;
    justify-content: space-around;
    padding: .5rem 0;
    .button{
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}
</style>
