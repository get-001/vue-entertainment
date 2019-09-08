<template>
  <div class="startGame" style="padding:0;">
    <mu-appbar style="width: 100%;" color="green500">
      <mu-button icon slot="left" @click="closePage">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      </mu-button>游戏进行中...
    </mu-appbar>
    <div class="content">
      <div
        class="card-item"
        :class="{active:item.open}"
        v-for="(item, index) in gameArr"
        :key="index"
        @click="!finish&&open(index)"
      >
        <mu-ripple class="mu-ripple" :opacity="0.7">
          <span class="name top-left">{{item.name}}</span>
          <div class="pivotal" :class="{finish:finish}">
            <span class="entry bottom-left">{{item.entry}}</span>
            <span
              class="identity bottom-right"
              :class="item.identity"
            >{{item.identity|analysisIdentity}}</span>
          </div>
        </mu-ripple>
      </div>

      <mu-dialog style="text-align:center;" title="游戏结束" width="360" :open.sync="openSimple">
        <h3>{{triumphType}}获胜</h3>
        <mu-button slot="actions" flat color="primary" @click="startAgain">重新开始</mu-button>
        <mu-button slot="actions" flat color="primary" @click="openSimple=false">关闭</mu-button>
      </mu-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ["gameArr"],
  data() {
    return {
      openSimple: false,
      triumphType: "",
      finish: false
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
    open(index) {
      this.gameArr[index].open = true;
      let quantity = {
        civilian: 0,
        dinting: 0,
        blank: 0
      };
      this.gameArr.forEach(ele => {
        if (!ele.open) {
          if (ele.identity === "blank") {
            quantity["blank"]++;
          } else if (ele.identity === "dinting") {
            quantity["dinting"]++;
          } else {
            quantity["civilian"]++;
          }
        }
      });
      if (quantity.dinting === 0 && quantity.blank === 0) {
        this.accomplish("平民");
      } else if (quantity.civilian === 0 && quantity.blank === 0) {
        this.accomplish("卧底");
      } else if (quantity.civilian === 0 && quantity.dinting === 0) {
        this.accomplish("白板");
      }
    },
    accomplish(type) {
      this.finish = true;
      this.triumphType = type;
      this.openSimple = true;
    },
    startAgain() {
      this.openSimple = false;
      this.$emit("startAgain");
    }
  }
};
</script>

<style lang="less" scoped>
.startGame {
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
      font-size: 20px;
      margin-bottom: -4px;
    }
    .mu-appbar-left {
      width: 45px;
    }
  }
  .content {
    position: relative;
    height: calc(100% - 45px - 40px);
    padding: 0 10px;
    margin: 20px 0;
    overflow-y: scroll;

    .card-item {
      position: relative;
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      color: #2196f3;
      border: 1px solid #2196f3;
      border-radius: 4px;
      background: #fff;
      font-size: 20px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: all 1s;
      overflow: hidden;
      .top-left {
        position: absolute;
        top: 5px;
        left: 8px;
        max-width: 70%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bottom-left {
        position: absolute;
        bottom: 13px;
        left: 20px;
        font-size: 25px;
        max-width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 30px;
      }
      .bottom-right {
        position: absolute;
        bottom: 5px;
        right: 8px;
        font-size: 25px;
        opacity: 0.5;
      }
      .pivotal {
        transition: all 1s;
        display: none;
        opacity: 0;
        color: #fff;
      }
    }
    .card-item:last-of-type {
      margin-bottom: 0;
    }
    .card-item.active {
      background: #2196f3;
      color: #fff;
      .pivotal {
        display: block;
        opacity: 1;
      }
    }
    .card-item:not(.active) {
      .pivotal.finish {
        display: block;
        opacity: 0.5;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>