<template>
  <div class="Begin" style="padding:0;">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="closePage">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </mu-button>查看词条
    </mu-appbar>
    <div class="content">
      <mu-text-field
        class="player-name"
        v-model="gameArr[currentIndex].name"
        placeholder="Please input..."
      ></mu-text-field>
      <mu-ripple
        v-if="!isExamine"
        :class="{beViewed:gameArr[currentIndex].beViewed}"
        @click="examine(currentIndex,true)"
        class="mu-ripple-card"
      >
        <p>点击查看</p>
        <span class="top-right">{{'#'+('000'+(currentIndex+1)).slice(-2)}}</span>
      </mu-ripple>
      <mu-ripple v-else @click="examine(currentIndex,false)" class="mu-ripple-card active">
        <!-- <span class="identityType">{{gameArr[currentIndex].identity|analysisIdentity}}</span> -->
        <span>{{gameArr[currentIndex]["entry"]}}</span>
        <span class="top-right">{{'#'+('000'+(currentIndex+1)).slice(-2)}}</span>
      </mu-ripple>
      <div class="btn-wrap" v-if="!isExamine">
        <mu-button
          v-if="currentIndex!=0"
          @click="currentIndex--"
          class="btn-bottom-left"
          color="grey500"
        >上一个</mu-button>
        <mu-button
          v-if="currentIndex!=gameArr.length-1"
          @click="currentIndex++"
          class="btn-bottom-right"
          color="primary"
        >下一个</mu-button>
        <mu-button
          v-if="currentIndex===gameArr.length-1"
          class="btn-bottom-right"
          color="green500"
          @click="open"
        >开始</mu-button>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from "timers";

export default {
  props: ["gameArr"],
  data() {
    return {
      playerName: "xxx",
      currentIndex: 0,
      isExamine: false,
      timer: null
    };
  },
  filters: {
    analysisIdentity(type) {
      if (type === "blank") {
        type = "白板";
      } else if (type === "dinting") {
        type = "卧底";
      } else {
        type = "平民";
      }
      return type;
    }
  },
  methods: {
    closePage() {
      this.$emit("closePage");
    },
    open() {
      this.$emit("open");
    },
    examine(index, is) {
      clearTimeout(this.timer);
      this.isExamine = is;
      if (is) {
        this.gameArr[index].beViewed = true;
        this.timer = setTimeout(() => {
          this.isExamine = false;
        }, 2000);
      }
    }
  }
};
</script>

<style lang="less">
.Begin {
  z-index: 11;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;

  .mu-appbar {
    padding: 0;
    height: 45px;
    .mu-appbar-title {
      line-height: 45px;
      font-size: 18px;
      margin-bottom: -4px;
    }
    .mu-appbar-left {
      width: 45px;
    }
  }
  .content {
    position: relative;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 45px);

    .mu-ripple-card {
      position: relative;
      width: 90%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border-radius: 10px;
      color: #2196f3;
      border: 1px solid #2196f3;
      overflow: hidden;
      font-size: 30px;
      font-weight: 600;
      transition: all 1s;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .identityType {
        position: absolute;
        top: 10px;
        left: 10px;
      }
      .top-right {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
      }
    }
    .mu-ripple-card.active {
      background: #2196f3;
      color: #fff;
    }
    .mu-ripple-card.beViewed {
      background: #fff;
      color: #aaa;
      border: 1px solid #aaa;
    }
    .player-name {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
      .mu-text-field-input {
        text-align: center;
      }
    }
    .btn-bottom-right {
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
    .btn-bottom-left {
      position: absolute;
      bottom: 15px;
      left: 15px;
    }
  }
}
</style>