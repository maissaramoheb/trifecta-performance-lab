# V2.1 builder bilingual copy contract

Arabic is primary, professional Egyptian Arabic, with stable English operational terms retained where useful. Arabic and English must carry equivalent meaning rather than literal wording.

## Canonical labels

| Concept | Arabic UI label | English UI label |
|---|---|---|
| Level | المستوى | Level |
| Station | المحطة | Station |
| Drill | التمرين · Drill | Drill |
| Gate | بوابة الانتقال · Gate | Progression Gate |
| Evidence | الدليل الملاحظ | Observable evidence |
| Critical Failure | فشل حرج | Critical Failure |
| Go | Go — انتقال | Go — Progress |
| No-Go | No-Go — لا انتقال | No-Go — Do not progress |
| Need More Data | Need More Data — نحتاج دليل إضافي | Need More Data |
| Retest | إعادة الاختبار · Retest | Retest |
| Remediation | المعالجة التدريبية | Remediation |
| Reset | إعادة الضبط · Reset | Reset |

Use `dir="ltr"` for IDs, timestamps and isolated English codes. Use `dir="auto"` for mixed-direction evidence text. Directional arrows must mirror in RTL.

## Shared validation messages

| State | Arabic | English |
|---|---|---|
| required | الحقل ده مطلوب قبل الحفظ. | This field is required before saving. |
| Arabic missing | أضف الصياغة العربية. | Add the Arabic wording. |
| English missing | أضف الصياغة الإنجليزية. | Add the English wording. |
| duplicate ID | المعرّف مستخدم بالفعل. اختَر معرّفًا ثابتًا وفريدًا. | This ID is already used. Choose a stable, unique ID. |
| broken reference | الرابط يشير إلى عنصر غير موجود. راجع العلاقات قبل الحفظ. | This link points to a missing item. Review relationships before saving. |
| unsaved | عندك تغييرات غير محفوظة. | You have unsaved changes. |
| import blocked | الاستيراد متوقف لحماية البيانات. راجع الأخطاء الموضحة. | Import is blocked to protect your data. Review the listed errors. |
| recovery available | توجد نسخة آمنة يمكن استعادتها. | A safe recovery copy is available. |
| critical override | تم تسجيل فشل حرج. القرار No-Go وغير قابل للتعويض بأي درجة. | A Critical Failure was recorded. The decision is No-Go and cannot be offset by any score. |

## Empty and error states

### Level Builder

- Empty AR: `مفيش مستويات لسه. أنشئ أول مستوى وحدد ناتج التعلم وشروط الدخول والإكمال.`
- Empty EN: `No Levels yet. Create the first Level and define its learning outcome, entry criteria, and completion criteria.`
- Relationship error AR: `المستوى مرتبط بمحطة غير موجودة. أصلح الرابط قبل النشر.`
- Relationship error EN: `This Level references a missing Station. Repair the link before publishing.`

### Station Builder

- Empty AR: `مفيش محطات داخل المستوى ده. أنشئ محطة وحدد الـBaseline والأداء الملاحظ.`
- Empty EN: `No Stations exist in this Level. Create one and define its Baseline and observable performance.`
- Validation AR: `المحطة لازم تتبع مستوى موجود وتحتوي على Drill واحد على الأقل.`
- Validation EN: `A Station must belong to an existing Level and contain at least one Drill.`

### Drill Builder

- Empty AR: `مفيش Drills داخل المحطة دي. أضف Drill يجمع دليلًا واضحًا على أداء واحد.`
- Empty EN: `No Drills exist in this Station. Add a Drill that collects clear evidence for one performance.`
- Validation AR: `حدد السلوك، الشرط، المعيار، والدليل المطلوب بصورة قابلة للملاحظة.`
- Validation EN: `Define observable behaviour, conditions, criterion, and required evidence.`

### Gate Builder

- Empty AR: `المحطة دي مفيش بعدها Gate. أضف بوابة انتقال وحدد الدليل المطلوب للقرار.`
- Empty EN: `This Station has no Gate. Add a Progression Gate and define the evidence required for its decision.`
- Insufficient evidence AR: `الدليل غير كافٍ لقرار Go. اختَر Need More Data وحدد المطلوب جمعه.`
- Insufficient evidence EN: `Evidence is insufficient for Go. Select Need More Data and specify what must be collected.`
- No-Go AR: `الانتقال متوقف. أكمل المعالجة والـReset ثم نفّذ Retest حسب القاعدة المحددة.`
- No-Go EN: `Progression is blocked. Complete remediation and Reset, then Retest under the defined rule.`

Error summaries must receive focus after submission, link to invalid controls, and be announced through an accessible live region. Do not communicate status through colour alone.
