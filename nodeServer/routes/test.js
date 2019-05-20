var express = require('express');
var router = express.Router();

var Medicine = require('../models').Medicine;


router.get('/dbtest', function(req, res, next) {
	console.log("db get ??");
	res.send("response");
	Medicine.create({
		name: '마그밀정',
		ingredient: '수산화마그네슘 500mg',
		period: '성인 1일 1~2.5g을 수회 분할 경구 투여',
		effect: '위, 십이지장염, 위염, 위산과다, 변비증의 완화',
		caution: '신장애 환자, 설사 환자 투여 금지',
		company: '삼남제약',
		
});
	Medicine.create({
		name: '파파민액',
		ingredient: '건강 200mg/75mL, 스코폴리아엑스 20mg/75mL, 파파베린염산염 30mg/75mL',
		period: '성인 1회 1병 1일 3회 식후 경구투여',
		effect: '위통, 복통, 산통, 위산과다, 속쓰림 완화',
		caution: '약으로 알레르기 증상, 심장에 환자, 녹내장 또는 배뇨곤란이 있는 환자, 임부 투여 금지',
		company: '동성제약',
});
	Medicine.create({
		name: '베노플러스겔',
		ingredient: '무정형에스신 10mg, 살리실산글리콜 20mg, 헤파린나트륨 400단위',
		period: '상처나 감염된 부위에 1일 수회 엷게 바르고 흡수',
		effect: '정맥류상 부종, 표재성 정맥염, 사고시 외상, 운동시 부상, 건초염의 완화',
		caution: '살리실산염 과민반응 환자, 출산일 4주전 환자, 점막부위, 개방된 상처부위 투여 금지',	
		company: '유유제약',
});
	Medicine.create({
		name: '메이손로션',
		ingredient: '모메타손푸로에이트 1mg/g',
		period: '1일 1회 환부에 얇게 바르고 흡수',
		effect: '코르티코이드에 반응하는 피부질환의 가려움 및 염증의 완화',
		caution: '세균, 진균성 피부감염증 환자, 고막 천공, 궤양 환자에게는 투여 금지',
		company: '테라젠이텍스',
});
	Medicine.create({
		name: '한미유리아크림 200mg',
		ingredient: '우레아 200mg/g',
		period: '1일 1~수회 환부를 씻은 다음 이 약을 바르고 흡수',
		effect: '진행성 지장각피증, 손/발바닥 각피증, 어린선, 노인성 건피증, 모공성 태선 완화',
		caution: '안점막등의 점막, 급성 습진 또는 염증성 피부질환 환자 투여 금지',
		company: '한미약품',
});
	Medicine.create({
		name: '락티케어에취씨로션 1%',
		ingredient: '하드로코르티손 10mg/g',
		period: '사용 전 잘 흔들어 섞은 후 1일 1-3회 적당량 환부에 바르고 흡수',
		effect: '습진 피부염군, 피부가려움, 벌레물린데 완화',
		caution: '세균, 진균성 피부감염증 환자, 고막 천공, 궤양 환자에게는 투여 금지',
		company: '한국파마',
});


	Medicine.create({
		name: '다나큐아크림',
		ingredient: '글리시리진산디칼륨 5mg/g, 우레아 200mg/g, 토코페롤아세테이트 5mg/g',
		period: '1일 1~수회 적당량을 환부에 씻은 다음 흡수',
		effect: '고령자의 건피증, 성인의 거친 피부, 발뒤꿈치 및 복사뼈 부위의 각화증 완화',
		caution: '15세 미만의 소아 투여 금지',
		company: '광동제약',
});


	Medicine.create({
		name: '노바손크림',
		ingredient: '겐타마이신황산염 1mg/g, 베타메타손발레레이트 0.61mg/g',
		period: '1일 1~3회 환부에 적당량 바르고 흡수',
		effect: '2차 감염된 알레르기성 또는 염증성 피부질환의 완화',
		caution: '세균, 진균, 스페로헤타속, 효모, 바이러스 환자, 고막천공 환자 투여 금지 ',
		company: '녹십자',
});


	Medicine.create({
		name: '정우알두텍캡슐',
		ingredient: '니코틴산아미드 2.5mg, 리보플라빈 2.5mg, 복령가루 75mg, 시호가루 50mg',
		period: '성인 1회 2캡슐, 8~15세 1회 1캡슐 1일 2회 경구투여',
		effect: '알레르기 질환, 두드러기, 피부염, 습진, 한진의 완화',
		caution: '유당불내증 환자에게 투여 금지',
		company: '정우신약',
});
	Medicine.create({
		name: '라미실원스외용액',
		ingredient: '테르비나핀염산염 11.25mg/g',
		period: '단 1회 적용, 피부에 흡수',
		effect: '피부사상균에 의한 피부감염증, 족부백선의 완화',
		caution: '테르비나핀 및 이 약 성분에 과민증 병력이 있는 환자, 소아, 임부 투여 금지',
		company: '글락소스미스클라인컨슈머헬스케어코리아',
});
	Medicine.create({
		name: '진크피현탁액',
		ingredient: '피리티온아연액 40mg/g',
		period: '적당량을 취해 젖은 두피 위에 바르고 거품이 나도록 마사지한 후 물로 헹굼',
		effect: '비듬 및 두피의 지루피부염 완화',
		caution: '이 약 성분에 과민증 환자 투여 금지',
		company: '나노팜',
});
	Medicine.create({
		name: '두오필름겔',
		ingredient: '살리실산 167mg, 젖산 167mg',
		period: '1일 1회 2~4방울 취침 전 환부에 바른 뒤 흡수',
		effect: '사마귀의 완화',
		caution: '날 때부터 있는 점, 항문 및 생식기 사마귀등은 투여 금지',
		company: '글락소스미스클라인',
});
	Medicine.create({
		name: '콜로덤에스액',
		ingredient: '락트산 4.6g/100g, 살리실산 14g/100g',
		period: '1일 1~3회 환부에 바른 뒤 흡수',
		effect: '티눈, 굳은살, 사마귀의 완화',
		caution: '얼굴, 여성의 생식기, 눈 주변, 점막 등에 투여 금지',
		company: '고려제약',
});
	Medicine.create({
		name: '브레복실겔',
		ingredient: '과산화벤조일 0.04g',
		period: '환부를 깨끗이 씻어내고 이 약을 1일 1-2회 가볍게 두드리며 바른 뒤 흡수',
		effect: '심상성여드름의 완화',
		caution: '비타민A유도체 함유 여드름약과 함께 투여 금지',
		company: '글락소스미스클라인컨슈머헬스케어코리아',
});
	Medicine.create({
		name: '큐아크네크림',
		ingredient: '이부프로펜피코놀 30mg/g, 이소프로필메틸페놀 3mg/g',
		period: '1일 수 회, 비누 등으로 세안 후 적당량을 환부에 바른 뒤 흡수',
		effect: '여드름, 뾰루지의 완화',
		caution: '눈, 눈 주위 투여 금지',
		company: '광동제약',
});


	Medicine.create({
		name: '치센캡슐',
		ingredient: '디오스민 300mg',
		period: '성인 1회 300mg 1일 2회 경구투여',
		effect: '치질, 모세혈관취약증에 의한 출혈증상 완화',
		caution: '위장장애, 과민성 피부발진, 심계항진등이 나타날 수 있음',
		company: '동국제약',
});
	Medicine.create({
		name: '후바후바정',
		ingredient: '헵타미놀염산염 300mg, 은행엽엑스 14mg, 트록세루틴 300mg',
		period: '정맥질환 1회 1정, 1일 2회 경구투여',
		effect: '하지중압감, 정맥염, 야간 다리경련의 완화',
		caution: '갑상선기능항진증 환자, MAO저해제를 투여중인 환자 투여 금지',
		company: '대화제약',
});

	Medicine.create({
		name: '펜잘큐정',
		ingredient: '아세트아미노펜 300mg, 에텐자미드 200mg, 카페인무수물 50mg',
		period: '1일 3회까지 공복을 피하여 경구투여, 투여 간격은 4시간 이상',
		effect: '두통, 치통, 발치후 동틍, 월경통, 인후통, 관절통의 완화',
		caution: '메일 세 잔 이상 정기적으로 술을 마시는 사람 투여 금지',
		company: '종근당',
});
	Medicine.create({
		name: '노블루겔',
		ingredient: '헤파리노이드 3mg/g',
		period: '통상, 증상에 따라 적량을 1일 1~수회 문질러 바르고 흡수',
		effect: '외상의 통증, 혈종, 힘줄주위조직염, 근육통, 관절염의 완화',
		caution: '출혈성 혈액 질환, 근소한 출혈에서의 중대한 결과 초래하는 환자 투여 금지',
		company: '제이더블유중외제약',
});
	Medicine.create({
		name: '케토톱겔',
		ingredient: '케토프로펜 30mg',
		period: '1일 1~4회 환부에 바르고 흡수',
		effect: '퇴행성관절염, 어깨관절주위염, 건초염, 근육통의 완화',
		caution: '아스피린 천식, 티아프로펜산, 페노피브레이트, 베자피브레이트에 과민한 환자 투여 금지',
		company: '한독',
});

	Medicine.create({
		name: '스멕타현탁액',
		ingredient: '디옥타헤드랄스멕타이트 3g/20mL',
		period: '성인 1회 3g을 1일 3회 경구 복용',
		effect: '식도, 위.십이지장과 관련된 통증의 완화',
		caution: '다른 약물을 복용하고 있는 환자, 심한 만성 변비 환자 투여 금지',
		company: '대웅제약',
});


//끝
});


module.exports = router;

