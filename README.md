# slack-graph [![CircleCI](https://circleci.com/gh/6/slack-graph.svg?style$svg)](https://circleci.com/gh/6/slack-graph)

slack `/graph` command to graph arbitrary data using ascii bar charts.

```
/graph 3,19,28

 ==================== | 28
 ==============       | 19
 ==                   | 3
 ```

```
/graph ios,desktop,android 25,10,54

 android | ==================== | 54
     ios | =========            | 25
 desktop | ====                 | 10
```

```
/graph 25,10,54 $

 $$$$$$$$$$$$$$$$$$$$ | 54
 $$$$$$$$$            | 25
 $$$$                 | 10
```
