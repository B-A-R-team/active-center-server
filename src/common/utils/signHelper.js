/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/**
 * 依赖 "moment": "^2.29.1"
 */
import moment from 'moment';

export default function SignHelper() {

}

SignHelper.prototype = {
  /**
   *
   *从时间戳中获取时间
   * @param {String} str 时间戳
   * @return {String} time 时间
   */
  getTimeByTimeStamp(str) {
    let time = moment(str).format('HH:mm:ss');
    if (time === 'Invalid date') {
      time = moment(Date.now()).format('HH:mm:ss');
    }
    return time;
  },

  /**
   *
   *从时间戳中获取日期
   * @param {String} str 时间戳
   * @return {String} date 日期
   */
  getDateByTimeStamp(str) {
    let date = moment(str).format('yyyy-MM-DD');
    if (date === 'Invalid date') {
      date = moment(Date.now()).format('yyyy-MM-DD');
    }
    return date;
  },

  /**
   *
   *根据开始日期、结束日期返回日期列表。
   * @param {String} startStr 开始日期,默认当天日期
   * @param {String} endStr 结束日期,默认当天日期
   * @return {Array} dateList 日期列表
   */
  getListByTime(startStr, endStr) {
    startStr = this.getDateByTimeStamp(startStr);
    endStr = this.getDateByTimeStamp(endStr);

    const dayTime = 3600 * 24 * 1000;
    const start = Date.parse(startStr);
    const end = Date.parse(endStr);
    const dateList = [];
    for (let time = start; time <= end; time += dayTime) {
      dateList.push(this.getDateByTimeStamp(time));
    }
    return dateList;
  },

  /**
   *
   * 开始日期与结束日期容错处理。
   * @param {String} startTime 开始日期,默认当天日期
   * @param {String} endTime 结束日期,默认当天日期
   * @return {Object} { startTime, endTime } { 开始日期, 结束日期 }
   */
  TimeFitter(startTime, endTime) {
    if (!(startTime && endTime)) {
      startTime = (startTime || endTime);
      endTime = (startTime || endTime);
    }
    startTime = this.getDateByTimeStamp(startTime);
    endTime = this.getDateByTimeStamp(endTime);
    if (endTime < startTime) {
      const time = startTime;
      startTime = endTime;
      endTime = time;
    }
    return {
      startTime,
      endTime,
    };
  },

  /**
   *团队签到数据组装
   *
   * @param {Array} teamList 团队列表
   * @param {Array} dataList 数据列表
   * @return {Array} teamList 数据组装后的团队列表
   */
  TeamDataAssembly(teamList, dataList) {
    teamList.forEach((item) => {
      item.chartData = [];
      for (let i = 0; i < dataList.length; i += 1) {
        if (dataList[i].team_id === item.id) {
          item.chartData.push(dataList[i].day_count);
        }
      }
    });
    return teamList;
  },

  /**
   *时间段内用户签到数据组装
   *
   * @param {*} dateList 时间列表
   * @param {*} singList 签到列表
   * @return {*} chartData 数据组装后的用户签到信息
   */
  UserDataAssembly(dateList, signList) {
    const chartData = new Array(dateList.length);
    for (let i = 0; i < chartData.length; i += 1) {
      chartData[i] = [];
    }
    signList.forEach((item) => {
      for (let i = 0; i < dateList.length; i += 1) {
        if (this.getDateByTimeStamp(item.sign_time) === dateList[i]) {
          chartData[i].push(item.sign_time);
        }
      }
    });
    return chartData;
  },


  /**
   *
   *获取一周前后的日期节点
   * @return {Object} { startTime, endTime } { 一周前日期, 当天日期 }
   */
  getWeekDate() {
    const nowDate = Date.now();
    const weekAgo = nowDate - 3600 * 24 * 1000 * 6;
    const {
      startTime,
      endTime,
    } = this.TimeFitter(nowDate, weekAgo);
    return {
      startTime,
      endTime,
    };
  },


  /**
   *返回当前的日期
   * @return {String} Date 现在的日期
   */
  getTodayDate() {
    return this.getDateByTimeStamp(Date.now());
  },

  /**
   * 返回格式化的当前日期时间
   * @returns
   */
  getDateTime() {
    return moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
  },


  /**
   * 检查日期格式是否正确
   * @param {String} DateStr 日期字符串
   * @returns {Boolean}
   */
  CheckTime(DateStr = '') {
    return moment(DateStr).isValid();
  },


  /**
   *签到策略
   * @param {Array}  _signList 当日签到数据列表
   * @param {String} type 签到策略
   * @return {*} { isAllowSign, message } { 是否允许签到, 消息 }
   */
  SignInStrategy(_signList, type) {
    // 各种签到策略
    const Strategy = {
      // (每日一次签到)
      day_once(signList) {
        let isAllowSignIn = true;
        let message = '今日未签到';
        if (signList.length >= 1) {
          isAllowSignIn = false;
          message = '今日已签到,无须重复签到';
        }
        return {
          isAllowSignIn,
          message,
        };
      },
      // (每日一签一退)
      day_InAndOut(signList) {
        let isAllowSignIn = true;
        let isAllowSignOut = true;
        let message = '今日未签到';
        if (signList.length >= 1) {
          isAllowSignIn = false;
          message = '今日已签到';
          // 检查签退字段日期格式
          const signOut_time = signList[0].signOut_time || '';
          if (signOut_time) {
            isAllowSignOut = false;
            message = '今日已签退';
          }
        } else {
          isAllowSignOut = false;
        }
        return {
          isAllowSignIn,
          isAllowSignOut,
          message,
        };
      },
    };
    if (!Strategy[type]) {
      return {
        isAllowSign: false,
        message: '没有该签到策略',
      };
    }
    return Strategy[type](_signList);
  },

};
