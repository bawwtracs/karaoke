<template>
  <div class="karaoke" :style="option.wrapperStyle">
    <Songs :class="{'hidden': !list, 'list': true}" :songs="option.songs" @playSong="playSong" />
    <div :class="{'hidden': list}" class="ui">
      <Recorder ref="recorder" :debug="debug" :option="option" @onplayend="onplayend" />
      <LyricPlayer ref="lyricPlayer" :debug="debug" :lyric-arr="option.lyricArrs[option.playingIndex]" :rows="12" />
      <MusicPlayer v-show="!finish" ref="musicPlayer" :debug="debug" :songs="option.songs" :idx="option.playingIndex" @play="play" @pause="toggle" @end="end" />
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
      <div class="button" plain type="default" :class="{'disabled': !recording}" @click="stop">
        <van-icon name="stop-circle-o" />
        <div>结束</div>
      </div>
      <div class="button" plain type="default" :class="{'disabled': !recording}" @click="replay">
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
        wrapperStyle: `background: linear-gradient(to right bottom, rgb(232, 203, 192), rgb(99, 111, 164))`, // 录音页背景样式,
        playingIndex: 0, // 正在播放的歌曲序号
        songs: [
          {
            name: '没有共产党就没有新中国',
            artist: '中国人民解放军军乐团',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/mygcdjmyxzg.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/mygcdjmyxzg.jpg'
          },
          {
            name: '爱我中华',
            artist: '宋祖英',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/awzh.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/awzh.jpg'
          },
          {
            name: '我爱我的祖国',
            artist: '常思思',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/wawdzg.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/wawdzg.jpg'
          },
          {
            name: '妈妈教我一支歌',
            artist: '殷秀梅',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/mmjwyzg.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/byqxgd.jpg'
          },
          {
            name: '把一切献给党',
            artist: '戴玉强',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/byqxgd.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/mmjwyzg.jpg'
          },
          {
            name: '不忘初心',
            artist: '国家大剧院合唱团',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/bwcx.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/bwcx.jpg'
          },
          {
            name: '唱支山歌给党听',
            artist: '北京市少年宫合唱团',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/czsggdt.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/czsggdt.jpg'
          },
          {
            name: '党啊亲爱的妈妈',
            artist: '殷秀梅',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/daqadmm.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/daqadmm.jpg'
          },
          {
            name: '十送红军',
            artist: '中国国家交响乐团',
            url: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/sshj.mp3',
            cover: 'https://yisfot-activity-sg.oss-cn-shenzhen.aliyuncs.com/song/sshj.jpg'
          }
        ],
        lyricArrs: [
          [
            '[00:08.65] 没有共产党就没有新中国，',
            '[00:13.17] 没有共产党就没有新中国，',
            '[00:17.34] 共产党辛劳为民族，',
            '[00:21.65] 共产党他一心救中国，',
            '[00:25.83] 他指给了人民解放的道路，',
            '[00:30.03] 他领导中国走向光明，',
            '[00:34.43] 他坚持了抗战八年多，',
            '[00:36.30] 他改善了人民生活，',
            '[00:39.03] 他建设了敌后根据地，',
            '[00:40.78] 他实行了民主好处多。',
            '[00:43.68] 没有共产党就没有新中国，',
            '[00:47.87] 没有共产党就没有新中国。',
            '[00:56.27] 没有共产党就没有新中国,',
            '[01:00.65] 没有共产党就没有新中国,',
            '[01:05.06] 共产党辛劳为民族，',
            '[01:09.36] 共产党他一心救中国，',
            '[01:13.36] 他指给了人民解放的道路，',
            '[01:17.71] 他领导中国走向光明,',
            '[01:22.26] 他坚持了抗战八年多，',
            '[01:24.00] 他改善了人民生活，',
            '[01:26.30] 他建设了敌后根据地，',
            '[01:28.38] 他实行了民主好处多。',
            '[01:32.87] 没有共产党就没有新中国,',
            '[01:35.79] 没有共产党就没有新中国。'
          ],
          [
            '[00:10.58] 爱我中华',
            '[00:14.11] 爱我中华',
            '[00:16.73] 爱我中华',
            '[00:18.40] 赛罗赛罗赛罗赛罗赛罗赛罗',
            '[00:22.44] 嘿……',
            '[00:24.85] 五十六个星座五十六支花',
            '[00:29.01] 五十六族兄弟姐妹是一家',
            '[00:33.35] 五十六种语言汇成一句话',
            '[00:37.54] 爱我中华爱我中华爱我中华',
            '[00:41.95] 嘿罗嘿罗嘿罗嘿罗嘿罗嘿罗',
            '[00:48.42] 爱我中华',
            '[00:50.49] 五十六个星座五十六支花',
            '[00:54.68] 五十六族兄弟姐妹是一家',
            '[00:58.94] 五十六种语言汇成一句话',
            '[01:03.29] 爱我中华爱我中华爱我中华',
            '[01:07.78] 爱我中华',
            '[01:09.84] 健儿奋起步伐',
            '[01:11.87] 爱我中华',
            '[01:14.03] 建设我们的国家',
            '[01:16.14] 爱我中华',
            '[01:18.58] 中华英姿焕发',
            '[01:20.74] 爱我中华',
            '[01:22.73] 五十六族兄弟姐妹',
            '[01:24.60] 五十六种语言汇成一句话',
            '[01:29.06] 爱我中华',
            '[01:58.85] 赛罗赛罗赛罗赛罗赛罗赛罗',
            '[01:59.63] 五十六个星座五十六支花',
            '[02:01.38] 五十六族兄弟姐妹是一家',
            '[02:05.49] 五十六种语言汇成一句话',
            '[02:09.80] 爱我中华爱我中华',
            '[02:11.96] 爱我中华',
            '[02:14.56] 嘿罗嘿罗嘿罗嘿罗嘿罗嘿罗',
            '[02:20.91] 爱我中华',
            '[02:22.80] 爱我中华',
            '[02:24.76] 健儿奋起步伐',
            '[02:26.85] 爱我中华',
            '[02:29.06] 建设我们的国家',
            '[02:31.19] 爱我中华',
            '[02:33.35] 中华雄姿英发',
            '[02:35.50] 爱我中华',
            '[02:37.55] 五十六族兄弟姐妹',
            '[02:39.57] 五十六种语言汇成一句话',
            '[02:43.84] 爱我中华',
            '[03:03.52] 五十六个星座五十六支花',
            '[03:08.00] 五十六族兄弟姐妹是一家',
            '[03:11.91] 五十六种语言汇成一句话',
            '[03:16.09] 爱我中华爱我中华爱我中华',
            '[03:20.48] 嘿罗嘿罗嘿罗嘿罗嘿罗嘿罗',
            '[03:26.93] 爱我中华',
            '[03:29.15] 五十六个星座五十六支花',
            '[03:33.37] 五十六族兄弟姐妹是一家',
            '[03:37.49] 五十六种语言汇成一句话',
            '[03:43.18] 爱我中华爱我中华爱我中华',
            '[03:46.28] 爱我中华',
            '[03:48.35] 健儿奋起步伐',
            '[03:50.45] 爱我中华',
            '[03:52.55] 建设我们的国家',
            '[03:54.79] 爱我中华',
            '[03:56.87] 中华雄姿英发',
            '[03:59.01] 爱我中华',
            '[04:01.22] 五十六族兄弟姐妹',
            '[04:03.20] 五十六种语言汇成一句话',
            '[04:07.71] 爱我中华',
            '[04:11.63] 嘿'
          ],
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
            '[00:46.60] 妈妈教我一支歌',
            '[00:54.10] 没有共产党就没有新中国',
            '[01:01.77] 这支歌从妈妈心头飞出',
            '[01:09.32] 这支歌伴随她走遍祖国山河',
            '[01:20.47] 啊------',
            '[01:28.55] 这支歌伴随她走遍祖国山河',
            '[01:51.33] 我唱妈妈教的歌',
            '[01:58.80] 没有共产党就没有新中国',
            '[02:06.52] 这支歌从我的心上飞出',
            '[02:14.33] 这支歌鼓舞我建设新生活',
            '[02:25.12] 啊------',
            '[02:27.30] 这支歌鼓舞我建设新生活',
            '[02:31.18] 我唱妈妈教的歌',
            '[02:32.27] 没有共产党就没有新中国',
            '[02:34.90] 这支歌飞进幼小心田',
            '[02:43.98] 这支歌世世代代永不落',
            '[02:48.47] 啊',
            '[02:53.25] 这支歌世世代代永不落'
          ],
          [
            '[00:28.33] 那一天你拉着我的手',
            '[00:33.28] 让我跟你走',
            '[00:37.49] 我怀着那赤诚的向往',
            '[00:42.29] 走在你身后',
            '[00:46.77] 跟你涉过冰冷的河流',
            '[00:51.80] 患难同经受',
            '[00:55.98] 跟你走过坎坷的小路',
            '[01:01.56] 从春走到秋',
            '[01:07.71] 跟你饱尝过风霜雨雪',
            '[01:14.77] 跟你共同饮过胜利美酒',
            '[01:22.04] 千里万里我也没回头',
            '[01:28.93] 千里万里',
            '[01:36.83] 啊',
            '[01:44.76] 我也没回头',
            '[02:02.00] 如今你还拉着我的手',
            '[02:07.04] 继续跟你走',
            '[02:11.38] 我迈着那坚定的脚步',
            '[02:16.31] 走在你身后',
            '[02:20.95] 为你捧出火红的青春',
            '[02:25.66] 一路去追求',
            '[02:30.23] 为你抛洒滚烫的热血',
            '[02:35.98] 奉献我所有',
            '[02:42.28] 也许还要走过无数岁月',
            '[02:49.33] 幸福的热望总在',
            '[02:52.75] 总在心头',
            '[02:56.19] 千年万年',
            '[02:59.88] 我也不回头',
            '[03:03.36] 千年万年',
            '[03:10.72] 啊',
            '[03:18.02] 我也不回头',
            '[03:23.70] 永不回头'
          ],
          [
            '[00:09.87] 万水千山不忘来时路',
            '[00:15.90] 鲜血浇灌出花开的国度',
            '[00:22.42] 生死相依只为了那一份承诺',
            '[00:29.16] 报答你是我唯一的倾诉',
            '[00:35.37] 树高千尺根深在沃土',
            '[00:42.01] 你是大地给我万般呵护',
            '[00:48.42] 生生不息只为了那一份托付',
            '[00:55.51] 无惧风雨迎来新日出',
            '[01:02.55] 你是我的一切我的全部',
            '[01:08.79] 向往你的向往 幸福你的幸福',
            '[01:15.71] 不忘初心 继续前进',
            '[01:21.78] 万水千山 最美中国道路',
            '[01:28.39] 你是我的一切我的全部',
            '[01:34.84] 向往你的向往 幸福你的幸福',
            '[01:41.21] 不忘初心 继续前进',
            '[01:47.82] 万水千山 最美中国道路',
            '[01:54.32] 你是我的一切我的全部',
            '[02:01.01] 向往你的向往 幸福你的幸福',
            '[02:07.19] 不忘初心 继续前进',
            '[02:14.01] 万水千山 最美中国道路',
            '[02:21.66] 万水千山 最美中国道路'
          ],
          [
            '[00:17.47] 唱支山歌给党听，',
            '[00:26.93] 我把党来比母亲;',
            '[00:35.68] 母亲只生了我的身，',
            '[00:44.25] 党的光辉照我心。',
            '[01:05.99] 旧社会鞭子抽我身，',
            '[01:11.30] 母亲只会泪淋淋;',
            '[01:20.73] 共产党号召我闹革命，',
            '[01:25.45] 夺过鞭子揍敌人。',
            '[01:30.32] 共产党号召我闹革命，',
            '[01:34.36] 夺过鞭子，夺过鞭子揍敌人!',
            '[01:51.90] 唱支山歌给党听，',
            '[02:00.42] 我把党来比母亲;',
            '[02:09.41] 母亲只生了我的身，',
            '[02:17.88] 党的光辉照我心，',
            '[02:28.79] 党的光辉照我心 。'
          ],
          [
            '[00:16.54] 妈妈哟妈妈',
            '[00:20.90] 亲爱的妈妈',
            '[00:23.55] 你用那甘甜的乳汁',
            '[00:27.41] 把我喂养大',
            '[00:30.88] 扶我学走路',
            '[00:34.22] 教我学说话',
            '[00:38.22] 唱着夜曲伴我入眠',
            '[00:41.83] 心中时常把我牵挂',
            '[00:45.52] 妈妈哟妈妈',
            '[00:49.29] 亲爱的妈妈',
            '[00:52.69] 你的品德多么朴实无华',
            '[00:59.93] 妈妈哟妈妈',
            '[01:03.80] 亲爱的妈妈',
            '[01:07.16] 你激励我走上革命生涯',
            '[01:14.35] 亲爱的妈妈',
            '[01:32.50] 党啊党啊',
            '[01:36.81] 亲爱的党啊',
            '[01:39.89] 您就象妈妈一样',
            '[01:43.43] 把我培养大',
            '[01:47.01] 教育我爱祖国',
            '[01:50.57] 鼓励我学文化',
            '[01:54.26] 幸福的明天向我招手',
            '[01:58.18] 四化美景您描画',
            '[02:01.63] 党啊党啊',
            '[02:05.11] 亲爱的党啊',
            '[02:08.83] 您的形象多么崇高伟大',
            '[02:16.32] 党啊党啊',
            '[02:19.99] 亲爱的党啊',
            '[02:23.98] 您就是我最亲爱的妈妈',
            '[02:30.55] 亲爱的妈妈',
            '[03:03.23] 妈妈哟妈妈',
            '[03:06.86] 亲爱的妈妈',
            '[03:10.42] 你激励我走上革命生涯',
            '[03:17.68] 党啊党啊',
            '[03:21.32] 亲爱的党啊',
            '[03:24.73] 您就是我最亲爱的妈妈',
            '[03:32.25] 亲爱的妈妈',
            '[03:35.82] 亲爱的妈妈',
            '[03:40.38] 啊~~~~~~~~'
          ],
          [
            '[00:14.68] 一送(里格)红军(介支个)下了山',
            '[00:21.42] 秋风(里格)细雨(介支个)缠绵绵',
            '[00:28.07] 山上(里格)野鹿 声声哀号',
            '[00:34.72] 树树(里格)梧桐 叶呀叶落光',
            '[00:41.43] 问一声亲人 红军啊',
            '[00:48.12] 几时(里格)人马(介支个)再回山',
            '[00:54.74] 三送(里格)红军(介支个)到拿山',
            '[01:01.42] 山上(里格)包谷(介支个)金灿灿',
            '[01:07.76] 包谷种子(介支个)红军种',
            '[01:14.62] 包谷棒棒咱们穷人掰',
            '[01:21.38] 紧紧拉住红军手 红军啊',
            '[01:28.19] 洒下的种子(介支个)红了天',
            '[01:34.93] 五送(里格)红军(介支个)过了坡',
            '[01:41.39] 鸿雁(里格)阵阵(介支个)空中过',
            '[01:48.14] 鸿雁(里格)能够捎书信',
            '[01:54.73] 鸿雁(里格)飞到天涯海角',
            '[02:01.42] 千言万语嘱咐 红军啊',
            '[02:08.17] 捎信(里格)多把(介支个)革命说',
            '[02:14.82] 七送(里格)红军(介支个)五斗江',
            '[02:21.37] 江上(里格)船儿(介支个)穿梭忙',
            '[02:28.23] 千军万马(介支个)江畔站',
            '[02:34.82] 十万百姓泪汪汪',
            '[02:41.45] 恩情似海不能忘 红军啊',
            '[02:48.19] 革命成功(介支个)早归乡',
            '[02:54.90] 九送红军上大道',
            '[03:01.53] 锣儿无声鼓不敲 鼓不敲',
            '[03:07.98] 双双(里格)拉着长茧的手',
            '[03:14.62] 心像(里格)黄连脸在笑',
            '[03:21.30] 血肉之情怎能忘 红军啊',
            '[03:28.16] 盼望(里格)早日(介支个)传捷报',
            '[03:48.08] 十送(里格)红军(介支个)望月亭',
            '[03:54.76] 望月(里格)亭上(介支个)搭高台',
            '[04:01.65] 高台(里格)十丈白玉柱',
            '[04:08.61] 雕龙(里格)画凤放呀放光彩',
            '[04:14.79] 朝也盼来晚也想 红军啊',
            '[04:21.52] 这台(里格)名叫(介支个)望红台',
            '[04:27.85] '
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
      if (!this.recording) {
        return
      }
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
      if (!this.recording) {
        return
      }
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
      &.disabled{
        color: #bebebe;
      }
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}
</style>
