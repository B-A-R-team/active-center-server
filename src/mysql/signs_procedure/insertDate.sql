--  创建日期时间表
CREATE TABLE `mydate` ( `id` INT ( 10 ) NOT NULL AUTO_INCREMENT, `mydate` datetime DEFAULT NULL, PRIMARY KEY ( `id` ) ) ENGINE = INNODB AUTO_INCREMENT = 1;
-- 创建日期时间表数据填充存储过程
CREATE	PROCEDURE insertDate(
	IN startTime VARCHAR(10),
	IN endTime VARCHAR(10)
)
BEGIN
	DECLARE i INT DEFAULT 0;
	DECLARE beginDate datetime;
	DECLARE endDate datetime;
	DECLARE difDay int DEFAULT 0;
	set beginDate = DATE_FORMAT(startTime,'%Y-%m-%d %H:%i:%s');
	set endDate = DATE_FORMAT(endTime,'%Y-%m-%d %H:%i:%s');
	SELECT (TO_DAYS(endDate) - TO_DAYS(beginDate)) INTO difDay;
	WHILE i < difDay DO
		INSERT INTO mydate(mydate) VALUES(DATE_ADD(beginDate,INTERVAL i DAY));
		SET i = i + 1;
	END WHILE;
END;

-- 调用存储过程insterDate()
CALL insertDate('2021-01-01','2023-01-01');
-- 查询时间日期表
select * from mydate WHERE mydate BETWEEN '2021-01-02' AND '2021-01-24';

