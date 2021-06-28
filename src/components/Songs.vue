<template>
  <div class="songs">
    <div v-for="(item, idx) in songs" :key="idx" class="song">
      <div class="thumb">
        <van-image class="cover" :src="item.cover" :fit="'fill'" />
      </div>
      <div class="desc">
        <div class="name">
          {{ item.name }}
        </div>
        <div class="artist">
          {{ item.artist }}
        </div>
      </div>
      <div class="button btn-grad" @click="play(idx)" />
    </div>
  </div>
</template>

<script>
import { Image } from 'vant'

export default {
  name: 'Songs',
  components: {
    [Image.name]: Image
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      state: {
        loading: false,
        finished: false
      }
    }
  },
  mounted() {
  },
  unmounted() {
  },
  methods: {
    play(idx) {
      this.$emit('playSong', idx)
    }
  }
}
</script>

<style lang="less" scoped>
.songs{
    margin: .5rem;
    overflow: auto;

    .song{
        border-top: solid 1px #fff;
        border-bottom: solid 1px #fff;
        display: flex;
        align-items: center;
        margin: .5rem 0;
        .thumb{
            flex-shrink: 0;
            width: 88px;
            height: 88px;
            .cover{
                width: 100%;
                height: 100%;
            }
        }
        .desc{
            flex-grow: 1;
            .name{

            }
            .artist{

            }
        }
        .button{
            margin: 0 .25rem;
            padding: 4px;
            border-radius: 50%;
            border: solid 1px #fff;
            flex-shrink: 0;
            height: 40px;
            width: 40px;
            background: url('../assets/microphone.png') no-repeat center;
            box-shadow: 0 0 20px #eee;
        }

    }
}
</style>
