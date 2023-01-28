fetch(
    'https://flights.ctrip.com/international/search/api/search/batchSearch?v=0.26640006001113337',
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
        scope: 'd',
        'sec-ch-ua':
          '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        sign: '95d6980f18af6d16871abeee71e6575e',
        transactionid: '36580fcbdc6f49de922c5fa7607897d8',
      },
      referrer:
        'https://flights.ctrip.com/online/list/oneway-BJS-HYN?_=1&depdate=2022-01-22&containstax=1',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: '{"flightWayEnum":"OW","arrivalProvinceId":16,"extGlobalSwitches":{"useAllRecommendSwitch":true,"unfoldPriceListSwitch":true},"arrivalCountryName":"中国","infantCount":0,"cabin":"Y_S","cabinEnum":"Y_S","departCountryName":"中国","flightSegments":[{"departureDate":"2022-01-22","arrivalProvinceId":16,"arrivalCountryName":"中国","arrivalCountryCode":"CN","departureCityName":"北京","departureCityCode":"BJS","departureCountryName":"中国","departureCountryCode":"CN","arrivalCityName":"台州","arrivalCityCode":"HYN","departureCityTimeZone":480,"arrivalCountryId":1,"timeZone":480,"departureCityId":1,"departureCountryId":1,"arrivalCityTimeZone":480,"departureProvinceId":1,"arrivalCityId":578}],"childCount":0,"segmentNo":1,"scope":"d","adultCount":1,"extensionAttributes":{"LoggingSampling":false,"isFlightIntlNewUser":false},"transactionID":"36580fcbdc6f49de922c5fa7607897d8","directFlight":false,"departureCityId":1,"isMultiplePassengerType":0,"noRecommend":false,"flightWay":"S","arrivalCityId":578,"departProvinceId":1}',
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
  ).then(data => console.log(data));
