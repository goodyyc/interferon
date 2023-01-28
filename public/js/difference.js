var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom, null, { renderer: 'canvas' });
function draw(file) {
  Promise.all([
    fetch('data/collections/' + file + '.json'),
    fetch('data/sortedSpecies.json'),
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(datas => {
      let json = datas[0];
      let species = datas[1];
      //-
      $('#main').css('height', 50 * json['data'].length + 200);
      myChart.resize();
      let mp = {};
      for (let i = 0; i < species.length; i++) {
        mp[species[i].join('_')] = i;
      }

      json['data'].sort((a, b) => mp[a['species']] - mp[b['species']]);


      function renderItem(params, api) {
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        let width = api.size([1, 0])[0] * 0.8;
        var height = api.size([0, 1])[1] * 0.4;
        let x0 = start[0] + 3;
        let x1 = start[0] + width + 3;
        let y0 = start[1] - height / 2;
        let y1 = start[1] + height / 2;
        let points = [];
        if (api.value(5) == '+')
          points = [
            [x0, y0],
            [x0, y1],
            [x1 - width / 4, y1],
            [x1, (y0 + y1) / 2],
            [x1 - width / 4, y0],
          ];
        else
          points = [
            [x0, (y0 + y1) / 2],
            [x0 + width / 4, y1],
            [x1, y1],
            [x1, y0],
            [x0 + width / 4, y0],
          ];
        var rectShape = echarts.graphic.clipPointsByRect(
          points,
          //- {
          //-     x: start[0],
          //-     y: start[1] - height / 2,
          //-     width: 30,
          //-     height: height
          //- },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          }
        );
        return (
          rectShape && {
            type: 'polygon',
            transition: ['shape', 'style', 'extra'],
            shape: { points: rectShape },
            style: api.style(),
            focus: 'series',
            emphasis: {
              style: api.styleEmphasis({
                lineWidth: 5,
                //- stroke: deeper[api.visual('color')]
                stroke: '#000a',
              }),
            },
            select: {
              style: api.styleEmphasis({
                lineWidth: 5,
                //- stroke: deeper[api.visual('color')]
                stroke: '#000a',
              }),
            },
            textContent: {
              transition: ['shape', 'style'],
              style: {
                text: api.value(2),
                fill: '#444d',
                //- backgroundColor: '#fff0',
                //- padding:0,
                //- borderRadius:10
              },
              emphasis: {
                style: {
                  text: api.value(2),
                  fill: '#000f',
                  //- backgroundColor:api.visual('color')+'bb',
                  //- padding:10,
                  //- borderRadius:10
                },
              },
            },
            textConfig: { position: 'inside', rotation: -0.7 },
          }
        );
      }

      var option;

      var data = [];
      var yAxis = [];
      var color = ['#bd6d6c', '#7b9ce1', '#75d874', '#75d874'];
      let deeper = { '#bd6d6c': '#955', '#7b9ce1': '#68c', '#75d874': '#6b6' };
      topGene = json['top'];
      //- let topLen = 0;
      //- for (;topLen < topGene.length;topLen++)
      //-     if (topGene[topLen][1]<3)
      //-         break;
      let legend = [];
      let legendColor = [];
      let series = [];
      for (let i = 0; i < topGene.length; i++) {
        let name = topGene[i][0];
        legend.push(name);
        series.push({
          type: 'custom',
          name: name,
          renderItem: renderItem,
          encode: {
            x: [1, 8],
            y: 0,
          },
          //- animation: false,
          selectedMode: true,
          data: [],
        });
      }
      let maxLength = 0;
      json['data'].forEach(function (x, index) {
        maxLength = Math.max(maxLength, x['data'].length);
        let temp = x['species'].split('_');
        temp.push(x['chromosome']);
        temp.push(x['start'] + '~' + x['end']);
        yAxis.push(temp.join('\n'));
        for (let i = 0; i < x['data'].length; i++) {
          y = x['data'][i];
          if (y['gene'] != '#') {
            let borderWidth = 0;
            if (!y['same']) borderWidth = 0;
            gene = y['gene'];
            let j = 0;
            for (; j < topGene.length; j++) if (topGene[j][0] == gene) break;
            series[j]['data'].push({
              name: gene,
              value: [
                index,
                i,
                gene,
                y['exon'],
                y['product'],
                y['direction'],
                y['start'],
                y['end'],
                i + 1,
              ],
              itemStyle: {
                color: color[y['type']],
                borderType: 'solid',
                borderColor: '#fffb',
                borderWidth: borderWidth,
              },
            });
          }
        }
      });
      heitht = document.getElementById('main').clientHeight;
      option = {
        tooltip: {
          formatter: function (params) {
            return (
              params.marker +
              params.name +
              '<br> number of exon: ' +
              params.value[3] +
              '<br>product: ' +
              params.value[4] +
              '<br>start: ' +
              params.value[6] +
              '<br>end: ' +
              params.value[7]
            );
          },
        },
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            //- top: height-200,
            labelFormatter: '',
            startValue: 0,
            endValue: 30,
            minValueSpan: 20,
            maxValueSpan: 500,
            realtime: false,
          },
          {
            type: 'inside',
            filterMode: 'weakFilter',
          },
        ],
        grid: {
          left: 200,
          right: 50,
          //- height: height-300
        },
        legend: {
          type: 'scroll',
          show: true,
          data: legend,
          inactiveBorderColor: '#555',
          inactiveBorderWidth: 3,
        },
        xAxis: {
          scale: true,
          splitLine: {
            show: false,
          },
          //- axisLabel: {
          //-     formatter: function (val) {
          //-         return Math.max(0, val - startTime) + ' ms';
          //-     }
          //- }
        },
        yAxis: {
          data: yAxis,
          splitLine: {
            show: true,
          },
          inverse: true,
        },
        series: series,
      };
      myChart.clear();
      option && myChart.setOption(option);
      fkOption = [...Array(100).keys()];

      myChart.on('legendselectchanged', params => {

        myChart.dispatchAction({
          type: 'legendSelect',
          name: params['name'],
        });
        myChart.dispatchAction({
          type: 'toggleSelect',
          seriesName: params['name'],
          dataIndex: 0,
        });
      });
      //- myChart.on('click',params=>{
      //-     console.log(params)
      //-     myChart.dispatchAction({
      //-         type:'toggleSelect',
      //-         seriesName:params['name'],
      //-         dataIndex:0
      //-     })
      //- })
      //- myChart.dispatchAction({
      //-     type:'select',
      //-     seriesName:'UBAP1',
      //-     dataIndex:0
      //- })
    });
}

fetch('data/collections/' + $('#select1').val() + '_list.json')
  .then(data => data.json())
  .then(json => {
    document.getElementById('select2 option').innerHTML = '';
    for (x of json) {
      document.getElementById('select2').innerHTML +=
        '<option value="' + x + '">' + x + '</option>';
    }
    draw(
      document.getElementById('select1').value +
        '_' +
        document.getElementById('select2').value
    );
  });

$('#select1').on('change', function () {
  fetch('data/collections/' + this.value + '_list.json')
    .then(data => data.json())
    .then(json => {
      $('#select2 option').remove();
      for (x of json) {
        $('#select2').append('<option value="' + x + '">' + x + '</option>');
      }
    });
});
$('#btn').on('click', function () {
  draw($('#select1').val() + '_' + $('#select2').val());
});
