--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (84bec44)
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AchievementType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AchievementType" AS ENUM (
    'TEST_COMPLETION',
    'PERFECT_SCORE',
    'STREAK',
    'LEARNING_HOURS',
    'CATEGORY_MASTER'
);


ALTER TYPE public."AchievementType" OWNER TO neondb_owner;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO neondb_owner;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationType" AS ENUM (
    'SYSTEM',
    'REMINDER',
    'ACHIEVEMENT',
    'TEST_RESULT',
    'NEW_CONTENT'
);


ALTER TYPE public."NotificationType" OWNER TO neondb_owner;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLE_CHOICE',
    'TRUE_FALSE',
    'ESSAY'
);


ALTER TYPE public."QuestionType" OWNER TO neondb_owner;

--
-- Name: RecordType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."RecordType" AS ENUM (
    'WEIGHT',
    'HEIGHT',
    'HEAD_CIRCUMFERENCE',
    'VACCINATION',
    'ILLNESS',
    'DEVELOPMENT',
    'OTHER'
);


ALTER TYPE public."RecordType" OWNER TO neondb_owner;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'AYAH',
    'IBU',
    'PENGASUH',
    'TENAGA_KESEHATAN',
    'KADER',
    'BIDAN'
);


ALTER TYPE public."UserRole" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text,
    type public."AchievementType" NOT NULL,
    requirement integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO neondb_owner;

--
-- Name: AppSettings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AppSettings" (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AppSettings" OWNER TO neondb_owner;

--
-- Name: Child; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Child" (
    id text NOT NULL,
    name text NOT NULL,
    "fullName" text,
    "dateOfBirth" timestamp(3) without time zone NOT NULL,
    gender public."Gender" NOT NULL,
    "isPremature" boolean DEFAULT false NOT NULL,
    "birthWeight" double precision,
    "currentWeight" double precision,
    "currentHeight" double precision,
    "bloodType" text,
    allergies text[],
    "medicalNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentId" text NOT NULL
);


ALTER TABLE public."Child" OWNER TO neondb_owner;

--
-- Name: HealthRecord; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."HealthRecord" (
    id text NOT NULL,
    "recordType" public."RecordType" NOT NULL,
    value text NOT NULL,
    unit text,
    notes text,
    "recordDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "childId" text NOT NULL
);


ALTER TABLE public."HealthRecord" OWNER TO neondb_owner;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "actionUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Notification" OWNER TO neondb_owner;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    "questionText" text NOT NULL,
    type public."QuestionType" DEFAULT 'MULTIPLE_CHOICE'::public."QuestionType" NOT NULL,
    options jsonb,
    "correctAnswer" text NOT NULL,
    explanation text,
    points integer DEFAULT 1 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "testId" text NOT NULL
);


ALTER TABLE public."Question" OWNER TO neondb_owner;

--
-- Name: Test; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Test" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "timeLimit" integer,
    "passingScore" integer DEFAULT 60 NOT NULL,
    "maxAttempts" integer DEFAULT 3 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "videoId" text NOT NULL
);


ALTER TABLE public."Test" OWNER TO neondb_owner;

--
-- Name: TestAttempt; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TestAttempt" (
    id text NOT NULL,
    score integer,
    "totalQuestions" integer NOT NULL,
    "correctAnswers" integer DEFAULT 0 NOT NULL,
    "isPassed" boolean DEFAULT false NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "timeSpent" integer,
    "userId" text NOT NULL,
    "testId" text NOT NULL,
    "starRating" integer DEFAULT 0
);


ALTER TABLE public."TestAttempt" OWNER TO neondb_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'BIDAN'::public."UserRole" NOT NULL,
    province text,
    city text,
    address text,
    "profileImage" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: UserAchievement; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."UserAchievement" (
    id text NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL
);


ALTER TABLE public."UserAchievement" OWNER TO neondb_owner;

--
-- Name: UserAnswer; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."UserAnswer" (
    id text NOT NULL,
    answer text NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    "answeredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "questionId" text NOT NULL,
    "testAttemptId" text NOT NULL
);


ALTER TABLE public."UserAnswer" OWNER TO neondb_owner;

--
-- Name: Video; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Video" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "youtubeId" text NOT NULL,
    "thumbnailUrl" text,
    duration integer,
    "targetRole" public."UserRole"[],
    "minAge" integer,
    "maxAge" integer,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."Video" OWNER TO neondb_owner;

--
-- Name: VideoCategory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VideoCategory" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    color text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VideoCategory" OWNER TO neondb_owner;

--
-- Name: VideoProgress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VideoProgress" (
    id text NOT NULL,
    "watchedDuration" integer DEFAULT 0 NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "videoId" text NOT NULL
);


ALTER TABLE public."VideoProgress" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Achievement" (id, name, description, icon, type, requirement, "isActive", "createdAt", "updatedAt") FROM stdin;
2	Learning Champion	Menyelesaikan 5 test dengan sukses	🏆	TEST_COMPLETION	5	t	2025-09-21 00:00:00	2025-09-21 00:00:00
3	Perfect Score	Mendapat nilai 100% dalam satu test	⭐	PERFECT_SCORE	100	t	2025-09-21 00:00:00	2025-09-21 00:00:00
1	First Test Completed	Selamat! Anda telah menyelesaikan test pertama	🎉	TEST_COMPLETION	1	t	2025-09-21 00:00:00	2025-09-21 00:00:00
4	Dedicated Learner	Menyelesaikan 10 test	📚	TEST_COMPLETION	10	t	2025-09-21 00:00:00	2025-09-21 00:00:00
\.


--
-- Data for Name: AppSettings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AppSettings" (id, key, value, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Child; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Child" (id, name, "fullName", "dateOfBirth", gender, "isPremature", "birthWeight", "currentWeight", "currentHeight", "bloodType", allergies, "medicalNotes", "createdAt", "updatedAt", "parentId") FROM stdin;
cmfmnhwxc0001ky04iiozezj5	hikkwkwjsj	nskslsksmd	2024-09-06 00:00:00	MALE	f	\N	12	120	\N	{}	\N	2025-09-16 14:31:07.788	2025-09-16 14:31:07.788	cmfay01qd0000i309ytec1xlh
cmfnokjo30001ky04b5tu4xh6	Samson	Samson Terkuat	2018-08-17 00:00:00	MALE	f	\N	50	165	\N	{}	\N	2025-09-17 07:48:56.378	2025-09-17 07:55:24.071	cmfb4yh620000jw09dkiuvc0u
\.


--
-- Data for Name: HealthRecord; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."HealthRecord" (id, "recordType", value, unit, notes, "recordDate", "createdAt", "childId") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Notification" (id, title, message, type, "isRead", "actionUrl", "createdAt", "userId") FROM stdin;
cmft2slc2000dl204khlksnas	Test Passed!	You passed the test "Stunting dan Generasi Emas" with score 100%	TEST_RESULT	f	/test-results/cmft2ntjf0001l204q0ec57oq	2025-09-21 02:25:57.506	cmfay01qd0000i309ytec1xlh
cmftbqlif000hl2044c84s6be	Test Passed!	You passed the test "Prakonsepsi" with score 80%	TEST_RESULT	f	/test-results/cmftbosff0005l204a0h6ktwr	2025-09-21 06:36:20.968	cmfay01qd0000i309ytec1xlh
cmftc5nyv000dl204tlxtxtuh	Test Passed!	You passed the test "Generasi Emas Bebas Stunting" with score 100%	TEST_RESULT	f	/test-results/cmftc3jds0001l204se0lwag7	2025-09-21 06:48:03.991	cmfay01qd0000i309ytec1xlh
cmftcoe5m000dle05atff1yoe	Test Completed	You completed the test "MP ASI" with score 40%	TEST_RESULT	f	/test-results/cmftcmss30001le05f7nq9imh	2025-09-21 07:02:37.739	cmfay01qd0000i309ytec1xlh
cmftcubf3000djp04763gnug6	Test Completed	You completed the test "Stunting dan Generasi Emas" with score 60%	TEST_RESULT	f	/test-results/cmftcsuh70001jp04alf0j9bg	2025-09-21 07:07:14.127	cmfay01qd0000i309ytec1xlh
cmftczn7v000rle05nigoqosh	Test Completed	You completed the test "Prakonsepsi" with score 60%	TEST_RESULT	f	/test-results/cmftcygb2000fle05pdov7tp1	2025-09-21 07:11:22.7	cmfay01qd0000i309ytec1xlh
cmftd3xqf000rjp04ro0jfps7	Test Completed	You completed the test "Generasi Emas Bebas Stunting" with score 60%	TEST_RESULT	f	/test-results/cmftd2rof000fjp04detp5xue	2025-09-21 07:14:42.951	cmfay01qd0000i309ytec1xlh
cmftdjicp000dl104sv8c19ew	Test Completed	You completed the test "MP ASI" with score 60%	TEST_RESULT	f	/test-results/cmftdi2370001l104a95gbtbe	2025-09-21 07:26:49.513	cmfay01qd0000i309ytec1xlh
cmftdnqsb000dkz04diq5tisz	Test Completed	You completed the test "Stunting dan Generasi Emas" with score 60%	TEST_RESULT	f	/test-results/cmftdmhbc0001kz0429cwfew6	2025-09-21 07:30:07.067	cmfay01qd0000i309ytec1xlh
cmftdtuap000rl104c1gl1lnj	Test Completed	You completed the test "Prakonsepsi" with score 0%	TEST_RESULT	f	/test-results/cmftdso8x000fl104bjqmi09y	2025-09-21 07:34:51.553	cmfay01qd0000i309ytec1xlh
cmftdxmz2000rkz04to765iau	Test Passed!	You passed the test "Stunting dan Generasi Emas" with score 100%	TEST_RESULT	f	/test-results/cmftdvsxn000fkz04n9efuufl	2025-09-21 07:37:48.686	cmfay01qd0000i309ytec1xlh
cmftfsz5t000dl8045cdhxv7x	Test Passed!	You passed the test "Stunting dan Generasi Emas" with score 100%	TEST_RESULT	f	/test-results/cmftfrlxg0001l804qhd6d19g	2025-09-21 08:30:10.433	cmfay01qd0000i309ytec1xlh
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Question" (id, "questionText", type, options, "correctAnswer", explanation, points, "order", "imageUrl", "createdAt", "updatedAt", "testId") FROM stdin;
cmfl1k5al0003jv04nla50goj	Apa yang dimaksud dengan kondisi stunting pada anak?	MULTIPLE_CHOICE	["Anak yang kurus karena kekurangan gizi akut.", "Anak yang kelebihan berat badan.", "Anak yang gagal tumbuh (pendek) karena kekurangan gizi kronis.", "Anak yang sering sakit-sakitan."]	Anak yang gagal tumbuh (pendek) karena kekurangan gizi kronis.	Stunting adalah kondisi kekurangan gizi yang terjadi dalam jangka waktu kronis atau lama. Akibatnya, pertumbuhan fisik anak terhambat dan ia menjadi lebih pendek dari tinggi standar usianya. Kondisi ini berbeda dengan gizi kurang atau gizi buruk yang biasanya bersifat akut (jangka pendek).	10	0	\N	2025-09-15 11:29:14.222	2025-09-15 11:29:14.222	cmfl1hcyz0001jv0473lmtwwe
cmfl1m6cx0005jv0417f161os	Kapan periode "1000 Hari Pertama Kehidupan" dimulai?	MULTIPLE_CHOICE	["Sejak anak berusia 1 tahun.", "Sejak anak lahir.", "Sejak masa konsepsi (Pembuahan) hingga anak berusia 2 tahun.", "Sejak anak mulai makan makanan pendamping ASI."]	Sejak masa konsepsi (Pembuahan) hingga anak berusia 2 tahun.	Periode emas ini dihitung sejak masa konsepsi (pembuahan), yaitu sekitar 270 hari selama kehamilan, ditambah 730 hari setelah kelahiran hingga anak berusia 2 tahun. Masa ini sangat krusial karena pertumbuhan dan perkembangan otak anak terjadi secara pesat.	10	0	\N	2025-09-15 11:30:48.913	2025-09-15 11:30:48.913	cmfl1hcyz0001jv0473lmtwwe
cmfl1o07b0007jv04emcg286e	Apa salah satu ciri dari "responsive feeding"?	MULTIPLE_CHOICE	["Memaksa anak menghabiskan makanannya.", "Memberikan makanan sambil anak menonton televisi.", "Memberi makan dengan memperhatikan sinyal lapar dan kenyang dari anak.", "Memberikan makanan dalam porsi yang sangat besar."]	Memberi makan dengan memperhatikan sinyal lapar dan kenyang dari anak.	Responsive feeding adalah cara memberikan makan dengan responsif terhadap sinyal lapar dan kenyang yang diberikan anak. Dengan metode ini, orang tua tidak memaksa anak untuk makan dan menciptakan suasana yang menyenangkan. Tujuannya adalah membangun hubungan positif anak dengan makanan dan mencegah trauma makan.	10	0	\N	2025-09-15 11:32:13.139	2025-09-15 11:32:13.139	cmfl1hcyz0001jv0473lmtwwe
cmfl1q0di0001l404bwmx76rx	Mengapa kesehatan mental ibu sangat penting dalam pengasuhan anak?	MULTIPLE_CHOICE	["Agar ibu terlihat selalu bahagia di media sosial.", "Agar ibu tidak pernah merasa lelah.", "Karena ibu yang bahagia dapat membantu anak tumbuh dengan nyaman dan percaya diri.", "Karena ibu yang sehat mentalnya tidak membutuhkan bantuan orang lain."]	Karena ibu yang bahagia dapat membantu anak tumbuh dengan nyaman dan percaya diri.	Kondisi kesehatan mental ibu sangat memengaruhi cara ia mengasuh anak. Ibu yang merasa bahagia, tenang, dan didukung akan lebih mampu memberikan pengasuhan yang penuh kasih sayang dan sabar. Lingkungan yang positif ini sangat penting untuk mendukung perkembangan emosional dan rasa percaya diri anak.	10	0	\N	2025-09-15 11:33:46.608	2025-09-15 11:33:46.608	cmfl1hcyz0001jv0473lmtwwe
cmfl1ratf0003l404t4h8x6iq	Nutrisi penting apa yang harus dipenuhi oleh calon ibu sebelum hamil untuk mencegah stunting?	MULTIPLE_CHOICE	["Asam folat dan zat besi.", "Vitamin C dan A.", "Gula dan Garam.", "Kopi dan teh."]	Asam folat dan zat besi.	Asam folat dan zat besi adalah dua nutrisi paling penting yang harus dipenuhi sebelum kehamilan. Asam folat berperan besar dalam pembentukan sel saraf dan otak janin, sementara zat besi mencegah anemia pada ibu hamil yang dapat berisiko pada kesehatan janin dan bayi.	10	0	\N	2025-09-15 11:34:47.965	2025-09-15 11:34:47.965	cmfl1hcyz0001jv0473lmtwwe
cmfl20jcp0003lb048xgpfbd0	Kapan bayi sebaiknya mulai diberikan MP ASI?	MULTIPLE_CHOICE	["Usia 4 bulan.", "Usia 5 bulan.", "Usia 6 bulan.", "Usia 1 tahun."]	Usia 6 bulan.	 Pada usia 6 bulan, ASI saja tidak lagi cukup untuk memenuhi kebutuhan gizi dan energi bayi yang terus meningkat. Ini adalah waktu yang tepat untuk memulai pengenalan makanan padat sebagai pendamping ASI.	10	0	\N	2025-09-15 11:41:58.947	2025-09-15 11:41:58.947	cmfl1xoqs0001lb04b2m3zpr8
cmfl22ebx0005lb04k5nb8yxu	Mengapa protein hewani penting dalam MP ASI?	MULTIPLE_CHOICE	["Agar bayi cepat merasa kenyang.", "Karena sumbernya mudah didapat.", "Karena rasanya lebih enak.", "Kaya akan zat besi dan seng yang penting untuk pertumbuhan otak dan tubu."]	Kaya akan zat besi dan seng yang penting untuk pertumbuhan otak dan tubu.	Protein hewani seperti daging, ayam, dan ikan kaya akan nutrisi penting seperti zat besi, seng, dan vitamin B12. Nutrisi ini sangat krusial untuk mencegah anemia defisiensi besi dan mendukung perkembangan kognitif serta fisik yang optimal.	10	0	\N	2025-09-15 11:43:25.751	2025-09-15 11:43:25.751	cmfl1xoqs0001lb04b2m3zpr8
cmfl23ril0007lb04shxtafxh	Bagaimana tekstur MP ASI yang dianjurkan untuk bayi usia 6 - 8 bulan?	MULTIPLE_CHOICE	["Makanan keluarga.", "Makanan cincang halus.", "Bubur saring dengan tekstur halus.", "Biskuit"]	Bubur saring dengan tekstur halus.	 Di awal MPASI, bayi memerlukan makanan dengan tekstur yang sangat halus (seperti bubur saring) agar mudah dicerna dan ditelan. Tekstur ini juga membantu bayi beradaptasi dengan makanan padat secara bertahap.	10	0	\N	2025-09-15 11:44:29.495	2025-09-15 11:44:29.495	cmfl1xoqs0001lb04b2m3zpr8
cmfl25hpc0009lb044zmk1227	Apa yang dimaksud dengan 'pemberian makan aktif' atau responsive feeding?	MULTIPLE_CHOICE	["Memberi makan sambil menyetelkan TV.", "Memaksa bayi menghabiskan makananya.", "Menciptakan suasana makan yang menyenangnkan dan meperhatikan sinyal lapar-kenyang bayi.", "Memberikan makan sesuai jadwal yang ketat."]	Menciptakan suasana makan yang menyenangnkan dan meperhatikan sinyal lapar-kenyang bayi.	 Prinsip 'responsive feeding' adalah memberi makan dengan penuh perhatian. Orang tua harus peka terhadap isyarat lapar dan kenyang dari bayi, tidak memaksa, dan menciptakan interaksi positif selama makan.	10	0	\N	2025-09-15 11:45:48.969	2025-09-15 11:45:48.969	cmfl1xoqs0001lb04b2m3zpr8
cmfl26zar000blb04kqt0zyma	Mengapa gula dan garam tidak dianjurkan dalam MP ASI hingga anak berusia 1 tahun?	MULTIPLE_CHOICE	["Agar bayi terbiasa dengan rasa makanan alami.", "Untuk mencegah anak rewel.", "Untuk menghindari risiko penyakit seperti diabetes dan gangguan ginjal.", "Agar berat badan anak tidak berlebihan."]	Untuk menghindari risiko penyakit seperti diabetes dan gangguan ginjal.	Ginjal bayi di bawah 1 tahun belum matang sepenuhnya sehingga tidak mampu memproses kelebihan garam. Sementara itu, asupan gula dapat meningkatkan risiko diabetes di kemudian hari dan membuat bayi ketergantungan pada rasa manis.	10	0	\N	2025-09-15 11:46:59.543	2025-09-15 11:46:59.543	cmfl1xoqs0001lb04b2m3zpr8
cmfl2g42c0003jr04r1vfipnv	Faktor-faktor apa saja yang dapat memengaruhi terjadinya stunting pada anak, menurut video tersebut?	MULTIPLE_CHOICE	["Genetika saja.", "Pemberian ASI, MPASI, dan kemanan pangan.", "Pendidikan orang tua dan pekerjaan.", "Aktivitas fisik anak yang berlebihan."]	Pemberian ASI, MPASI, dan kemanan pangan.	Video ini menjelaskan bahwa stunting dapat disebabkan oleh berbagai faktor, termasuk praktik menyusui yang kurang tepat, MPASI yang tidak memadai, serta kebersihan makanan dan air yang buruk.	10	0	\N	2025-09-15 11:54:05.633	2025-09-15 11:54:05.633	cmfl2c50z0001lb04yio9gq5o
cmfl2hjdi0005jr042tensnk7	Apa yang dimaksud dengan anemia dalam video ini?	MULTIPLE_CHOICE	["Kondisi kelebihan hemoglobin dalam darah.", "Kondisi kekurangan sel darah merah yang membawa oksigen.", "Penyakit genetik yang tidak bisa dicegah.", "Kekurangan asupan vitamin C."]	Kondisi kekurangan sel darah merah yang membawa oksigen.	 Anemia adalah kondisi di mana tubuh kekurangan hemoglobin, yaitu bagian dari sel darah merah yang berfungsi mengangkut oksigen ke seluruh tubuh.	10	0	\N	2025-09-15 11:55:12.132	2025-09-15 11:55:12.132	cmfl2c50z0001lb04yio9gq5o
cmfl2j9an0009jr04rcegutoa	Apa peran dari sanitasi yang buruk dan kebersihan yang rendah, menurut video?	MULTIPLE_CHOICE	["Dapat menyebabkan alergi pada anak.", "Dapat menyebabkan infeksi berulang yang mengganggu penyerapan gizi.", "Tidak memiliki hubungan dengan gizi anak.", "Hanya memengaruhi kesehatan mental anak."]	Dapat menyebabkan infeksi berulang yang mengganggu penyerapan gizi.	Lingkungan yang tidak higienis dapat membuat anak sering sakit karena infeksi. Infeksi yang berulang akan mengganggu proses penyerapan nutrisi dari makanan, yang pada akhirnya dapat berkontribusi pada stunting.	10	0	\N	2025-09-15 11:56:32.38	2025-09-15 11:56:32.38	cmfl2c50z0001lb04yio9gq5o
cmfl2jag7000bjr04uxwg8h6x	Apa peran dari sanitasi yang buruk dan kebersihan yang rendah, menurut video?	MULTIPLE_CHOICE	["Dapat menyebabkan alergi pada anak.", "Dapat menyebabkan infeksi berulang yang mengganggu penyerapan gizi.", "Tidak memiliki hubungan dengan gizi anak.", "Hanya memengaruhi kesehatan mental anak."]	Dapat menyebabkan infeksi berulang yang mengganggu penyerapan gizi.	Lingkungan yang tidak higienis dapat membuat anak sering sakit karena infeksi. Infeksi yang berulang akan mengganggu proses penyerapan nutrisi dari makanan, yang pada akhirnya dapat berkontribusi pada stunting.	10	0	\N	2025-09-15 11:56:32.828	2025-09-15 11:56:32.828	cmfl2c50z0001lb04yio9gq5o
cmfl2knfa000djr04b45usoxa	Siapa saja yang memiliki peran dalam mencegah stunting, menurut video?	MULTIPLE_CHOICE	["Hanya pemerintah dan tenaga kesehatan.", "Hanya orang tua dan keluarga inti.", "Semua pihak, termasuk orang tua, kader Posyandu, dan tenaga kesehatan.", "Hanya lembaga pendidikan dan sekolah."]	Semua pihak, termasuk orang tua, kader Posyandu, dan tenaga kesehatan.	Video ini menekankan bahwa pencegahan stunting adalah tanggung jawab bersama yang memerlukan kolaborasi dari berbagai pihak di masyarakat, bukan hanya satu pihak saja.	10	0	\N	2025-09-15 11:57:37.35	2025-09-15 11:57:37.35	cmfl2c50z0001lb04yio9gq5o
cmfl2qkga0005jm04iilj4pgx	Mengapa gizi prakonsepsi (sebelum kehamilan) dianggap sangat penting?	MULTIPLE_CHOICE	["Agar ibu terlihat sehat saat hamil.", "Karena gizi ibu saat hamil tidak terlalu berpengaruh.", "Untuk mecegah stunting, prematuritas, dan gangguan otak pada janin.", "Karena nutrisi yang masuk hanya berpengaruh pada ibu."]	Untuk mecegah stunting, prematuritas, dan gangguan otak pada janin.	Video ini menekankan bahwa masa 1000 Hari Pertama Kehidupan dimulai sejak konsepsi. Oleh karena itu, nutrisi yang terpenuhi sebelum kehamilan sangat krusial untuk memastikan perkembangan janin yang optimal dan mencegah risiko kesehatan serius.	10	0	\N	2025-09-15 12:02:13.42	2025-09-15 12:02:13.42	cmfl2of0r0003jm04tdwjydds
cmfl2rncl0007jm04c1p06aza	Nutrisi penting apa yang harus dikonsumsi minimal 3 bulan sebelum kehamilan untuk mencegah cacat tabung saraf pada janin?	MULTIPLE_CHOICE	["Vitamin C", "Kalsium", "Asam Folat", "Zat Besi"]	Asam Folat	Video ini menyebutkan bahwa asam folat sangat penting untuk perkembangan sel dan otak janin, dan harus dikonsumsi secara rutin, bahkan sejak sebelum hamil, untuk mencegah cacat tabung saraf.\n\n	10	0	\N	2025-09-15 12:03:03.831	2025-09-15 12:03:03.831	cmfl2of0r0003jm04tdwjydds
cmfl2sx750009jm04k4az9975	Menurut video, apa salah satu hal yang harus dihindari oleh calon ibu sebelum dan selama kehamilan?	MULTIPLE_CHOICE	["Minum air putih yang cukup.", "Makan sayur dan buah-buahan.", "Konsumsi rokok dan alkohol.", "Tidur yang cukup."]	Konsumsi rokok dan alkohol.	 Video dengan jelas menyarankan agar calon ibu dan ibu hamil menghindari zat-zat berbahaya seperti rokok dan alkohol karena dapat memberikan dampak negatif pada kesehatan janin.\n	10	0	\N	2025-09-15 12:04:03.251	2025-09-15 12:04:03.251	cmfl2of0r0003jm04tdwjydds
cmfl2u9sh000djm04hn7itbvx	Siapa saja yang memiliki peran dalam mendukung gizi prakonsepsi, menurut video?	MULTIPLE_CHOICE	["Hanya calon ibu itu sendiri.", "Hanya bidan dan tenaga kesehatan.", "Hanya keluarga inti.", "Semua pihak, termasuk pemerintah, sekolah, dan keluarga."]	Semua pihak, termasuk pemerintah, sekolah, dan keluarga.	Video ini menegaskan bahwa mewujudkan generasi yang sehat adalah tanggung jawab bersama. Diperlukan dukungan dari semua pihak, baik dari sektor kesehatan, pendidikan, maupun lingkungan terdekat seperti keluarga.	10	0	\N	2025-09-15 12:05:06.227	2025-09-15 12:05:06.227	cmfl2of0r0003jm04tdwjydds
cmfl2vidl000njm047k0woh4i	Apa dampak dari kekurangan gizi prakonsepsi dan selama 1000 HPK bagi anak?	MULTIPLE_CHOICE	["Anak akan memiliki berat badan berlebih.", "Anak akan tumbuh lebih tinggi dari standar.", "Perkembangan kognitif dan motorik anak terhambat.", "Anak menjadi lebih lincah dan aktif."]	Perkembangan kognitif dan motorik anak terhambat.	Dampak dari kekurangan gizi kronis tidak hanya memengaruhi pertumbuhan fisik (stunting) tetapi juga perkembangan otak dan kecerdasan anak, yang pada akhirnya akan menghambat potensi diri mereka.	10	0	\N	2025-09-15 12:06:02.887	2025-09-15 12:06:02.887	cmfl2of0r0003jm04tdwjydds
cmfl3h5jq0003jv040am6941s	Mengapa stunting menjadi ancaman serius bagi cita-cita Generasi Emas Indonesia 2045?	MULTIPLE_CHOICE	["Karena stunting dapat mengganggu perkembangan kognitif dan produktivitas anak di masa depan.", "Karena stunting hanya memengaruhi pertumbuhan tinggi badan.", "Karena stunting membuat anak mudah sakit.", "Karena stunting menyebabkan anak terlihat tidak menarik."]	Karena stunting dapat mengganggu perkembangan kognitif dan produktivitas anak di masa depan.	Stunting tidak hanya memengaruhi tinggi badan, tetapi juga perkembangan otak. Anak yang mengalami stunting memiliki kemampuan belajar dan produktivitas yang lebih rendah di masa depan, sehingga menghambat terwujudnya generasi yang unggul.	10	0	\N	2025-09-15 12:22:53.819	2025-09-15 12:22:53.819	cmfl3aazz001bjm04hxuafv67
cmfl3i9ro0005jv04yo13r47d	Selain stunting, masalah gizi apalagi yang disebutkan dalam video?	MULTIPLE_CHOICE	["Anemia dan wasting (gizi kurang)", "Obesitas dan diabetes.", "Kekurangan vitamin A dan C.", "Kelebihan gula dan garam."]	Anemia dan wasting (gizi kurang)	Video ini menyoroti tiga masalah gizi utama pada balita di Indonesia: stunting, anemia, dan wasting. Anemia adalah kekurangan zat besi, sementara wasting adalah kondisi sangat kurus.	10	0	\N	2025-09-15 12:23:45.945	2025-09-15 12:23:45.945	cmfl3aazz001bjm04hxuafv67
cmfl3jsjj0007jv04hj0cg9hn	Menurut video, kapan periode "1000 Hari Pertama Kehidupan" dimulai?	MULTIPLE_CHOICE	["Sejak konsepsi (pembuahan) hingga anak berusia 2 tahun.", "Saat anak lahir.", "Sejak anak berusia 6 bulan.", "Saat anak mulai berjalan."]	Sejak konsepsi (pembuahan) hingga anak berusia 2 tahun.	Periode emas ini dihitung sejak masa kehamilan (sekitar 270 hari) hingga anak berusia 2 tahun (730 hari). Masa ini adalah waktu krusial untuk pertumbuhan fisik dan otak anak.	10	0	\N	2025-09-15 12:24:56.934	2025-09-15 12:24:56.934	cmfl3aazz001bjm04hxuafv67
cmfl3leey0009jv04xtph71l6	Apa salah satu solusi yang disarankan video untuk mencegah stunting dan masalah gizi lainnya?	MULTIPLE_CHOICE	["Hanya mengandalkan program pemerintah.", "Hanya peran keluarga dalam pengasuhan.", "Kolaborasi dari keluarga, sekolah, komunitas, dan pemerintah.", "Hanya mengonsumsi makanan yang mahal dan impor."]	Kolaborasi dari keluarga, sekolah, komunitas, dan pemerintah.	Video ini menekankan bahwa pencegahan stunting adalah tanggung jawab bersama. Diperlukan kerja sama dari berbagai pihak di masyarakat untuk memastikan anak-anak mendapatkan gizi dan pengasuhan yang baik.	10	0	\N	2025-09-15 12:26:10.733	2025-09-15 12:26:10.733	cmfl3aazz001bjm04hxuafv67
cmfl3mksb000bjv04mfx3ozxp	Selain asupan gizi, apa lagi yang penting untuk mewujudkan generasi sehat, menurut video?	MULTIPLE_CHOICE	["Anak harus cepat bisa membaca.", "Pola asuh yang positif.", "Anak harus sering diberi hadiah.", "Mengirim anak ke sekolah favorit."]	Pola asuh yang positif.	Pola asuh yang positif (penuh perhatian dan dukungan) memiliki peran besar dalam perkembangan anak. Pengasuhan yang baik tidak hanya memengaruhi kesehatan fisik, tetapi juga perkembangan emosional dan kognitif anak.	10	0	\N	2025-09-15 12:27:06.833	2025-09-15 12:27:06.833	cmfl3aazz001bjm04hxuafv67
\.


--
-- Data for Name: Test; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Test" (id, title, description, "timeLimit", "passingScore", "maxAttempts", "isActive", "createdAt", "updatedAt", "videoId") FROM stdin;
cmfl1hcyz0001jv0473lmtwwe	Pengasuhan dan Mental Ibu Positif	Pertanyaan tentang pentingnya pola asuh positif dan responsive feeding sebagai bagian dari pengasuhan anak yang sehat.	\N	80	99	t	2025-09-15 11:27:04.207	2025-09-15 11:27:04.207	cmfl1dk5c0001l4048l66xlxc
cmfl1xoqs0001lb04b2m3zpr8	MP ASI	Makanan Pendamping ASI (MPASI), yang dirancang untuk membantu orang tua memastikan anak mendapatkan nutrisi optimal untuk tumbuh kembangnya.	\N	80	99	t	2025-09-15 11:39:46.18	2025-09-15 11:39:46.18	cmfl1uy810001jp04tbdk6sr2
cmfl2c50z0001lb04yio9gq5o	Generasi Emas Bebas Stunting	Pertanyaan tentang pentingnya 1000 Hari Pertama Kehidupan sebagai periode emas yang harus diperhatikan.	\N	80	99	t	2025-09-15 11:51:00.255	2025-09-15 11:51:00.255	cmfl2asgz0001jr04bcezh6zz
cmfl2of0r0003jm04tdwjydds	Prakonsepsi	Pertanyaan tentang pentingnya gizi prakonsepsi, yaitu nutrisi yang harus dipenuhi sebelum seorang wanita hamil.	\N	80	99	t	2025-09-15 12:00:33.068	2025-09-15 12:00:33.068	cmfl2mpya0001jm04iyahc337
cmfl3aazz001bjm04hxuafv67	Stunting dan Generasi Emas	Pertanyaan tentang pemahaman komprehensif tentang tantangan gizi dan bagaimana pencegahannya menjadi kunci untuk mencapai cita-cita Indonesia Emas 2045.	\N	80	99	t	2025-09-15 12:17:33.224	2025-09-15 12:17:33.224	cmfl32use0019jm0450jywq5f
\.


--
-- Data for Name: TestAttempt; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TestAttempt" (id, score, "totalQuestions", "correctAnswers", "isPassed", "isCompleted", "startedAt", "completedAt", "timeSpent", "userId", "testId", "starRating") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, name, email, phone, password, role, province, city, address, "profileImage", "isActive", "emailVerified", "createdAt", "updatedAt", "resetToken", "resetTokenExpiry") FROM stdin;
cmfaxy7bb0002lmqgz93vi8wb	Test User	test@example.com	\N	$2b$10$Ep2vi6ORehShXrHXfSLuo.fjLsZuy6h1CE1DfAnDA1P.iUi.lyZES	BIDAN	\N	\N	\N	\N	t	\N	2025-09-08 09:50:30.023	2025-09-08 09:50:30.023	\N	\N
cmfazhbi00000l109r669u7bj	Alpha	corneoalpha@gmail.com	\N	$2b$10$yImO1LJJXzBLdt/PZMWHuOHIx7YLwfgOb6V3mHQ39ZZCt/Ve0g8rC	BIDAN	\N	\N	\N	\N	t	\N	2025-09-08 10:33:21.528	2025-09-08 10:33:21.528	\N	\N
cmfb4yh620000jw09dkiuvc0u	Daniel	dalvero589@gmail.com	123123123	$2b$10$SKVeZ2Qp2q.wAMJr6GkDJe/XpkAwpRQje/nq7jKqkCXalsC1X7GvO	AYAH	Jawa Timur	Malang	Jln. Raya Candi	\N	t	\N	2025-09-08 13:06:40.107	2025-09-17 07:54:50.039	\N	\N
cmfnox0hb0000l4042jlio9iv	Jefry	danielalfero7@gmail.com	123	$2b$10$PDJ8Uxf/HQGHtEgnA3lf3OhWfDTaNEWZoLAeso0mDEzxtbDR/Xocu	TENAGA_KESEHATAN	Jawa Timur	Malang	Jln. Raya Candi	\N	t	\N	2025-09-17 07:58:38.255	2025-09-17 07:59:33.733	\N	\N
cmfnp8o570000l704wmt9alv4	redmi	reredminote14@gmail.com	\N	$2b$10$NuzFUn4hqQ2QJ22LaDavS.CveYhlSDkHacZ25MDhgt2BBHJsXjJA2	TENAGA_KESEHATAN	\N	\N	\N	\N	t	\N	2025-09-17 08:07:42.139	2025-09-17 08:07:42.139	\N	\N
cmfay01qd0000i309ytec1xlh	Alpharenooo	alphrenoorz@gmail.com	082143476748	$2b$12$zRghp7wG1z5YGGuxeIB6kOl5xcWSyTxbBZ030EgwQm87p103OOyyC	AYAH	Aceh	Malang	Batu	\N	t	\N	2025-09-08 09:51:56.102	2025-09-21 06:30:58.121	\N	\N
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."UserAchievement" (id, "earnedAt", progress, "isCompleted", "userId", "achievementId") FROM stdin;
\.


--
-- Data for Name: UserAnswer; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."UserAnswer" (id, answer, "isCorrect", points, "answeredAt", "userId", "questionId", "testAttemptId") FROM stdin;
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Video" (id, title, description, "youtubeId", "thumbnailUrl", duration, "targetRole", "minAge", "maxAge", "order", "isActive", "viewCount", "createdAt", "updatedAt", "categoryId") FROM stdin;
cmfl1dk5c0001l4048l66xlxc	Pengasuhan dan mental ibu positif dan makan responsif	Video ini membahas tentang pentingnya pola asuh positif dan responsive feeding sebagai bagian dari pengasuhan anak yang sehat. Video ini menekankan bahwa hubungan yang hangat antara orang tua dan anak sangat penting untuk membentuk karakter yang percaya diri dan empati. Selain itu, video juga menyoroti peran krusial dari kesehatan mental ibu, karena ibu yang bahagia dan sehat secara mental akan mampu menciptakan lingkungan yang nyaman bagi pertumbuhan anak.	rB70mw0mYME	https://img.youtube.com/vi/rB70mw0mYME/mqdefault.jpg	\N	{IBU,PENGASUH,TENAGA_KESEHATAN,AYAH,BIDAN,KADER}	13	24	0	t	0	2025-09-15 11:24:06.881	2025-09-15 11:24:06.881	cmfb137ut0000jr096d1tbiqc
cmfl1uy810001jp04tbdk6sr2	MP ASI	Video ini merupakan panduan lengkap tentang Makanan Pendamping ASI (MPASI), yang dirancang untuk membantu orang tua memastikan anak mendapatkan nutrisi optimal untuk tumbuh kembangnya. Video ini menjelaskan kapan waktu yang tepat untuk memulai MPASI (6 bulan), serta tanda-tanda kesiapan bayi.\n\nVideo ini juga memberikan informasi detail tentang:\n1. Prinsip MPASI: MPASI harus bergizi seimbang, aman, dan diberikan secara bertahap.\n2. Variasi Tekstur: Panduan tekstur MPASI yang disesuaikan dengan usia bayi, mulai dari bubur saring hingga makanan keluarga.\n3. Protein Hewani: Mengapa protein hewani sangat penting untuk pertumbuhan otak dan tubuh.\n4. Isi Piringku: Komposisi ideal MPASI yang seimbang untuk memenuhi kebutuhan gizi anak.\n5. Tips Penting: Hal-hal yang harus diperhatikan, seperti kebersihan, pemberian garam/gula, dan pengenalan makanan baru.	tMHR_I8IbaU	https://img.youtube.com/vi/tMHR_I8IbaU/mqdefault.jpg	\N	{IBU,PENGASUH,TENAGA_KESEHATAN,AYAH,KADER,BIDAN}	13	24	0	t	0	2025-09-15 11:37:38.494	2025-09-15 11:37:38.494	cmfb137ut0000jr096d1tbiqc
cmfl2asgz0001jr04bcezh6zz	Generasi Emas Bebas Stunting	Video ini membahas secara mendalam tentang stunting dan anemia sebagai dua masalah gizi utama yang sering terjadi pada anak. Video ini menguraikan berbagai faktor risiko yang memengaruhi stunting, mulai dari pemberian ASI, MPASI yang tidak tepat, hingga faktor lingkungan seperti sanitasi dan kebersihan.\n\nVideo ini juga menjelaskan secara singkat tentang anemia, penyebabnya, dan mengapa kondisi ini dapat menghambat pertumbuhan anak.\n\nSecara keseluruhan, video ini menekankan pentingnya 1000 Hari Pertama Kehidupan sebagai periode emas yang harus diperhatikan. Video ini memberikan langkah-langkah pencegahan yang jelas, termasuk pemberian ASI eksklusif, MPASI yang bergizi seimbang (terutama protein hewani), serta perlunya dukungan dari berbagai pihak seperti orang tua, tenaga kesehatan, dan program pemerintah untuk memastikan anak tumbuh sehat dan terhindar dari stunting serta anemia.	-w9UG1vNg_Q	https://img.youtube.com/vi/-w9UG1vNg_Q/mqdefault.jpg	\N	{IBU,PENGASUH,TENAGA_KESEHATAN,AYAH,KADER,BIDAN}	13	24	0	t	0	2025-09-15 11:49:57.318	2025-09-15 11:49:57.318	cmfb137ut0000jr096d1tbiqc
cmfl2mpya0001jm04iyahc337	Prakonsepsi	Video ini membahas tentang pentingnya gizi prakonsepsi, yaitu nutrisi yang harus dipenuhi sebelum seorang wanita hamil. Fokus utama video ini adalah mengedukasi masyarakat, terutama remaja putri dan calon ibu, bahwa kesehatan anak di masa depan sangat bergantung pada kondisi nutrisi ibu jauh sebelum kehamilan.\n\nDengan gizi prakonsepsi yang baik, berbagai risiko kesehatan pada janin, seperti stunting, kelahiran prematur, dan gangguan perkembangan otak, dapat dicegah. Video ini mengajak semua pihak, mulai dari individu, keluarga, hingga pemerintah, untuk berkolaborasi dan memastikan setiap calon ibu mendapatkan nutrisi yang cukup agar dapat melahirkan generasi yang tinggi, cerdas, dan sehat.	pgA9ZDlhm6k	https://img.youtube.com/vi/pgA9ZDlhm6k/mqdefault.jpg	\N	{IBU,PENGASUH,TENAGA_KESEHATAN,AYAH,KADER,BIDAN}	13	24	0	t	0	2025-09-15 11:59:13.923	2025-09-15 11:59:55.624	cmfb137ut0000jr096d1tbiqc
cmfl32use0019jm0450jywq5f	Stunting dan Generasi Emas	Video ini menyoroti tiga masalah gizi utama pada balita di Indonesia: stunting, anemia, dan wasting.\n\nStunting adalah kondisi gagal tumbuh akibat kekurangan gizi kronis. Video menjelaskan bahwa stunting tidak hanya menyebabkan tubuh pendek, tetapi juga mengganggu perkembangan kognitif anak, yang berdampak pada produktivitas mereka di masa dewasa.\n\nAnemia disebabkan oleh kurangnya zat besi, yang dapat menurunkan daya tahan tubuh dan kemampuan belajar anak.\n\nVideo ini menekankan bahwa untuk menciptakan generasi yang sehat, cerdas, dan bebas dari masalah gizi, diperlukan upaya kolaborasi dari keluarga, sekolah, komunitas, dan pemerintah.	m9d6xB0givQ	https://img.youtube.com/vi/m9d6xB0givQ/mqdefault.jpg	\N	{IBU,PENGASUH,TENAGA_KESEHATAN,AYAH,KADER,BIDAN}	13	24	0	t	0	2025-09-15 12:11:46.69	2025-09-15 12:11:46.69	cmfb137ut0000jr096d1tbiqc
\.


--
-- Data for Name: VideoCategory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VideoCategory" (id, name, description, icon, color, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmfb137ut0000jr096d1tbiqc	Stunting	Penceahan stunting pada anak	👶	#F59E0B	0	t	2025-09-08 11:18:22.854	2025-09-08 11:18:22.854
\.


--
-- Data for Name: VideoProgress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VideoProgress" (id, "watchedDuration", "isCompleted", "completedAt", "createdAt", "updatedAt", "userId", "videoId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: AppSettings AppSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AppSettings"
    ADD CONSTRAINT "AppSettings_pkey" PRIMARY KEY (id);


--
-- Name: Child Child_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "Child_pkey" PRIMARY KEY (id);


--
-- Name: HealthRecord HealthRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."HealthRecord"
    ADD CONSTRAINT "HealthRecord_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: TestAttempt TestAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TestAttempt"
    ADD CONSTRAINT "TestAttempt_pkey" PRIMARY KEY (id);


--
-- Name: Test Test_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- Name: UserAchievement UserAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY (id);


--
-- Name: UserAnswer UserAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UserAnswer"
    ADD CONSTRAINT "UserAnswer_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VideoCategory VideoCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoCategory"
    ADD CONSTRAINT "VideoCategory_pkey" PRIMARY KEY (id);


--
-- Name: VideoProgress VideoProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoProgress"
    ADD CONSTRAINT "VideoProgress_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Achievement_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Achievement_name_key" ON public."Achievement" USING btree (name);


--
-- Name: Achievement_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Achievement_type_idx" ON public."Achievement" USING btree (type);


--
-- Name: AppSettings_key_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AppSettings_key_key" ON public."AppSettings" USING btree (key);


--
-- Name: Child_parentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Child_parentId_idx" ON public."Child" USING btree ("parentId");


--
-- Name: HealthRecord_childId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "HealthRecord_childId_idx" ON public."HealthRecord" USING btree ("childId");


--
-- Name: HealthRecord_recordDate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "HealthRecord_recordDate_idx" ON public."HealthRecord" USING btree ("recordDate");


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_isRead_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Notification_isRead_idx" ON public."Notification" USING btree ("isRead");


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: Question_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Question_order_idx" ON public."Question" USING btree ("order");


--
-- Name: Question_testId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Question_testId_idx" ON public."Question" USING btree ("testId");


--
-- Name: TestAttempt_testId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TestAttempt_testId_idx" ON public."TestAttempt" USING btree ("testId");


--
-- Name: TestAttempt_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TestAttempt_userId_idx" ON public."TestAttempt" USING btree ("userId");


--
-- Name: Test_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Test_videoId_idx" ON public."Test" USING btree ("videoId");


--
-- Name: Test_videoId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Test_videoId_key" ON public."Test" USING btree ("videoId");


--
-- Name: UserAchievement_achievementId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserAchievement_achievementId_idx" ON public."UserAchievement" USING btree ("achievementId");


--
-- Name: UserAchievement_userId_achievementId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON public."UserAchievement" USING btree ("userId", "achievementId");


--
-- Name: UserAchievement_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserAchievement_userId_idx" ON public."UserAchievement" USING btree ("userId");


--
-- Name: UserAnswer_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserAnswer_questionId_idx" ON public."UserAnswer" USING btree ("questionId");


--
-- Name: UserAnswer_testAttemptId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserAnswer_testAttemptId_idx" ON public."UserAnswer" USING btree ("testAttemptId");


--
-- Name: UserAnswer_testAttemptId_questionId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "UserAnswer_testAttemptId_questionId_key" ON public."UserAnswer" USING btree ("testAttemptId", "questionId");


--
-- Name: UserAnswer_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserAnswer_userId_idx" ON public."UserAnswer" USING btree ("userId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_resetToken_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_resetToken_idx" ON public."User" USING btree ("resetToken");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: VideoCategory_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "VideoCategory_name_key" ON public."VideoCategory" USING btree (name);


--
-- Name: VideoCategory_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoCategory_order_idx" ON public."VideoCategory" USING btree ("order");


--
-- Name: VideoProgress_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoProgress_userId_idx" ON public."VideoProgress" USING btree ("userId");


--
-- Name: VideoProgress_userId_videoId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "VideoProgress_userId_videoId_key" ON public."VideoProgress" USING btree ("userId", "videoId");


--
-- Name: VideoProgress_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoProgress_videoId_idx" ON public."VideoProgress" USING btree ("videoId");


--
-- Name: Video_categoryId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Video_categoryId_idx" ON public."Video" USING btree ("categoryId");


--
-- Name: Video_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Video_order_idx" ON public."Video" USING btree ("order");


--
-- Name: Video_targetRole_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Video_targetRole_idx" ON public."Video" USING btree ("targetRole");


--
-- Name: Video_youtubeId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Video_youtubeId_idx" ON public."Video" USING btree ("youtubeId");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

