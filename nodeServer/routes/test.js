var express = require('express');
var router = express.Router();

var Medicine = require('../models').Medicine;


router.get('/dbtest', function(req, res, next) {
	console.log("db get ??");
	res.send("response");
	Medicine.create({
		name: '미놀에프트로키',
		ingredient: 'DL-메틸에피드린염산염 12.5mg, 구아야콜설폰산칼륨 45mg, 노스카핀 10mg',
		period: '만 15세 이상 성인 1회 1정씩 1일 6회 경구 복용',
		effect: '기침, 가래, 천식, 구내염등으로 인한 목 쉼, 목의 불쾌감의 통증 완화',
		caution: '임산부, 3개월 미만의 영아, MAO억제제를 복용하고 있거나 복용을 중단한 후 2주 이내의 사람 투여 금지',
		company: '경남제약',
		
});
	Medicine.create({
		name: '하디코프에프정',
		ingredient: '구아이페네신 40mg, 덱스트로메토르판브롬화수소산염수화물 8mg',
		period: '만 15세 이상 성인은 1일 3회, 1회 2정을 식후 30분에 경구투여',
		effect: '감기에 제증상의 완화',
		caution: '매일 세 잔 이상 정기적으로 술을 마시는 사람 투여 금지, 아세트아미노펜을 복용한 환자 금지',
		company: '광동제약',
});
	Medicine.create({
		name: '베부틴정',
		ingredient: '트리메부틴말레산염 100mg',
		period: '성인 1회 100-200mg 1일 3회 식전에 경구투여',
		effect: '식도역류 및 열공헤르니아, 위 십이지장염, 소화기능이상 완화',
		caution: '드물게 변비, 설사, 복명, 구역, 구토, 소화장애등이 나타날 수 있음',	
		company: '영일제약',
});
	Medicine.create({
		name: '지엘로페라미드염산염캡슐',
		ingredient: '로페라미드염산염 2mg',
		period: '성인 급성 설사의 경우 4mg 경구투여, 유지량으로 묽은 변이 있을 때마다 2mg씩을 경구투여하고 1일 최대투여량은 16mg',
		effect: '급성 설사, 만성 설사의 완화',
		caution: '24개월 미만의 영아, 소아, 혈변 및 고열이 있는 세균성 설사 환자 투여 금지',
		company: '지엘파마',
});
	Medicine.create({
		name: '잔탁정 150mg',
		ingredient: '라니티딘염산염 168mg',
		period: '성인 1회 150mg 1일 2회, 오전 및 취침시에 경구투여',
		effect: '위, 십이지장궤양, 졸링거-엘리슨증후군, 역류성식도염, 마취전 투약, 수술후 궤양, 비스테로이드소염진통제 투여로 인한 위, 십이지장궤양 완화',
		caution: '급성 포르피린증 병력이 있는 환자 투여 금지',
		company: '글락소스미스클라인',
});
	Medicine.create({
		name: '젠텔정 400mg',
		ingredient: '알벤다졸 400mg',
		period: '1일 1회 경구투여, 박멸을 위해 7일 뒤 한 번 더 1일 1회 경구투여',
		effect: '회충, 요충, 십이지장충, 편충, 아메라쿠 구충, 분선충의 감염 및 이들 혼합감염의 치료',
		caution: '임부 및 수유부, 2세 미만의 소아 투여 금지',
		company: '유한양행',
});
	Medicine.create({
		name: '후시딘히드로크림',
		ingredient: '푸시드산수화물 20mg/g, 히드로코르티손아세테이트 10mg/g',
		period: '1일 3회 적당량을 환부에 부드럽게 흡수',
		effect: '2차 세균 감염된 습진, 피부염군, 아토피피부염, 접촉피부염, 알레르기피부염, 지루피부염 완화',
		caution: '눈 또는 눈 주위, 세균, 진균, 바이러스, 동물성 피부감염증 환자, 고막천공이 있는 습진성 외이도염 환자, 3세 미만 유아 투여 금지',
		company: '동화약품',
});
	Medicine.create({
		name: '애니클렌액',
		ingredient: '클로르헥시딘글루콘산염액(20%) 1mL/100mL, 디부카인염산염 0.1g/100mL, 디펜히드라민염산염 0.3g/100mL',
		period: '1일 수회 적당량을 환부에 바름',
		effect: '긁힌 상처, 베인 상처, 창상, 손, 손가락의 살균 소독',
		caution: '클로르헥시딘 제제에 과민반응 환자, 뇌, 척수, 귀, 눈 등에 투여 금지',
		company: '(주)퍼슨',
});

/*
	Medicine.create({
		name: '비판텐연고',
		ingredient: '로라제팜 1mg',
		period: '성인 1일 1~4mg을 2~3회 분할 경구투여',
		effect: '신경증에서의 불안/긴장/우울 완화, 정신신체장애에서의 불안/긴장/우울 완화',
		caution: '중증의 근무력증 환자, 급성 좁은앞방각 녹내장 환자, 호흡부전, 수면무호흡증후군 환자 투여 금지',
		company: '환인제약',
});
	Medicine.create({
		name: '부광메티마졸정',
		ingredient: '메티마졸 5mg',
		period: '성인 1일 초기량을 경증인 경우에는 15mg, 중등도인 경우에는 30-40mg, 중증인 경우에는 60mg을 8시간 간격으로 1일 3회 분할 경구투여',
		effect: '갑상선기능한징증',
		caution: '무과립구증, 백혈구감소증 및 혈소판감소증 환자, 수유부 투여 금지',
		company: '부광약품',
});
	Medicine.create({
		name: '동성정로환당의정',
		ingredient: '크레오소트 22.5mg, 현초가루 25mg, 황백엑스산 33.75mg',
		period: '성인 및 15세 이상 1회 4정 경구투여',
		effect: '설사, 체함, 묽은변, 토사 완화',
		caution: '임부, 수유부, 만7세 이하의 소화, 투석 치료를 받고 있는 사람 투여 금지',
		company: '동성제약',
});
	Medicine.create({
		name: '판콜에이내복액',
		ingredient: '구아이페네신 80mg/30mL, 구연산카르베타펜탄 15mg/30mL 등',
		period: '성인 1회 30ml 1일 3회 식후 30분에 경구투여',
		effect: '감기 제증상의 완화',
		caution: '메일 세 잔 이상 정기적으로 술을 마시는 사람이 이 약이나 다른 해열 진통제 복용할 경우 금지, 다른 아세트아미노펜 제품과 함께 복용 금지',
		company: '동화약품',
});
	Medicine.create({
		name: '신신카타파프',
		ingredient: 'D-캄파 700mg, L-멘톨 100mg, 살리실산메틸 600mg, 티몰 20mg',
		period: '성인 1일 1~2회 환부에 부착',
		effect: '삠, 타박상, 근육통, 관절통, 신경통의 완화',
		caution: '30개월 이하의 유아, 습진, 옻 등에 의한 피부염, 상처부위에 투여 금지',
		company: '신신제약',
});
	Medicine.create({
		name: '마이드린캡슐',
		ingredient: '디클로랄페나존 100mg, 아세트아미노펜 325mg, 이소메텝텐뮤케이트 65mg',
		period: '성인 1회 1~2캅셀을 1일 3회까지 경구투여',
		effect: '긴장성 두통 및 혈관성 두통(편두통)완화',
		caution: '녹내장 환자, 심한 신장애 환자, 고혈압 환자, 기질성 심장애 환자, 간장애 환자, MAO 저해제를 투여받고 있는 환자에 투여 금지',
		company: '녹십자',
});
	Medicine.create({
		name: '아락실과립',
		ingredient: '아기오락스과립 2.7g/4g',
		period: '1회 4~8g을 1일 1회 취침전 또는 2회 복용하되, 씹지 말고 통상 아침에는 냉수, 저녁에는 온수로 경구투여',
		effect: '변비, 변비에 따른 식욕부진, 복부팽만, 장내이상발효, 치질 증상 완화',
		caution: '급성 복부질환 환자, 장폐색 환자, 위장관내의 협착증 환자 투여 금지',
		company: '부광약품',
});
	Medicine.create({
		name: '라미실원스외용액',
		ingredient: '테르비나핀염산염 11.25mg/g',
		period: '단 1회 적용, 발가락 사이 모두 얇게 펴 바르고 발바닥 전체와 발바닥으로부터 약 1.5cm 높이까지 이 약을 적용하며 필름이 될 때까지 1~2분간 건조',
		effect: 'Trichophyton, Microsporum canis 및 Epidermophyton floccosum과 같은 피부 사샹균에 의한 피부 감염증 완화',
		caution: '테르비나핀 및 이 약 성분에 과민증이 있는 환자, 임부, 15세 미만 소아 투여 금지',
		company: '글락소스미스클라인컨슈머헬스케어코리아',
});
	Medicine.create({
		name: '크레오신티외용액 1%',
		ingredient: '클린다마이신포스페이트 11.88mg/mL',
		period: '성인 1일 2회 환부에 얇게 도포',
		effect: '프로피오니박테륨 아크네 살상, 심상성여드름(보통여드름)완화',
		caution: '클린다마이신이나 린코마이신에 과민반응의 병력이 있는 환자, 국한성회장염 또는 궤양성대장염의 병력이 있는 환자, 항생물질 관련 대장염의 병력이 있는 환자, 임부, 수유부, 12세 이하 소아 투여 금지',
		company: '한독',
});
	Medicine.create({
		name: '알보칠콘센트레이트액',
		ingredient: '폴리크레줄렌액(50w/w&) 720mg/g',
		period: '용액을 적신 거즈를 이용해 가벼운 압력으로 해당 부위를 1~3분간 도포',
		effect: '질 세균 감염, 구내염 및 치육염 완화',
		caution: '이 약 성분에 과민반응 환자 투여 금지',
		company: '에스트라',
});
	Medicine.create({
		name: '프로페시아정 1mg',
		ingredient: '피나스테리드 1mg',
		period: '성인 남성 1일 1회 1mg 식사여부와 관련업이 투여',
		effect: '성인 남성의 남성형 탈모증(안드로겐 탈모증)의 치료',
		caution: '소아 환자 혹은 여성에게 투여 절대 금지, 임부, 우울증 환자 투여 금지',
		company: '한국엠에스디',
});
	Medicine.create({
		name: '개비스콘츄어블정',
		ingredient: '알긴산나트륨 250mg, 탄산수소나트륨 133.5mg, 탄산칼슘 80mg',
		period: '성인 및 12세 이상의 소아 1회 2~4정 1일 4회 식후 및 취침전 경구투여',
		effect: '위 식도 역류 증상(산 역류, 속쓰림, 소화불량) 완화',
		caution: '울혈심부전, 신장애 등과 같이 나트륨을 매우 제한해야 하는 환자, 고칼슘혈증, 신석회침착증과 재발성 칼슘함유 신결석 환자, 만 12세 미만의 소아에게 투여 금지',
		company: '옥시레킷벤키저',
});
	Medicine.create({
		name: '이가탄에프캡슐',
		ingredient: '아스코르브산 150mg, 리소짐염산염 30mg, 토코페롤아세테이트2배산 10mg, 카르바조크롬 2mg',
		period: '성인 1회 1캡슐 1일 3회 식후 경구투여',
		effect: '치주치료 후 치은염, 경/중증도 치주염의 보조치료',
		caution: '15세 미만 소아 투여 금지',
		company: '명인제약',
});
*/

//끝
});


module.exports = router;

