import http from 'k6/http';
import {sleep, check} from 'k6';
const postLogin = JSON.parse(open('../fixtures/postLogin.json'))

export const options = {
   // iterations: 50, 50 interacoes 
   // vus: 10, usuarios virtuais
   // duration: '30s',

   /*
   stage: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 30 }, //10 segundos a 30 usuarios virtuais
        { duration: '20s', target: 30 },
        { duration: '20s', target: 0 }
    ],
    */
   iterations: 1,
    thresholds: {
        http_req_duration: ['p(90)<3000', 'max<5000'],
         http_req_failed: ['rate<0.01']
    }
};


export default function () {
    const url = 'http://localhost:3000/login'

    postLogin.username = "julio.lima"
    console.log(postLogin)
    const payload = JSON.stringify(postLogin);

    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const res = http.post(url, payload, params);

    check(res, {
        'Validar que o Status é 200': (r) => r.status === 200,
        'Validar que o token é string': (r) => typeof(r.json().token) == 'string',
    })

    sleep(1);
}