import { db } from "../lib/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";
import { Questionnaire, SurveyResponse, AuditLog, AppUser, PromotionApplication } from "../types";

// Helper to check if database has seeded data
export async function isCollectionEmpty(collectionName: string): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.empty;
  } catch (error) {
    console.error(`Error checking if ${collectionName} is empty:`, error);
    return true;
  }
}

// === USERS COLLECTION ===
export async function saveUserToFirestore(username: string, userData: any): Promise<void> {
  if (!username) return;
  const lowercaseUsername = username.toLowerCase();
  try {
    await setDoc(doc(db, "users", lowercaseUsername), {
      ...userData,
      username: username // preserve capitalization if any
    }, { merge: true });
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }
}

export async function saveAllUsersToFirestore(usersMap: Record<string, any>): Promise<void> {
  try {
    const batch = writeBatch(db);
    Object.entries(usersMap).forEach(([rawUsername, userData]) => {
      const lowercaseUsername = rawUsername.toLowerCase();
      const userRef = doc(db, "users", lowercaseUsername);
      batch.set(userRef, {
        ...userData,
        username: rawUsername
      }, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error("Error saving all users in batch to Firestore:", err);
  }
}

export async function fetchUsersFromFirestore(): Promise<Record<string, any>> {
  const usersMap: Record<string, any> = {};
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((document) => {
      const data = document.data();
      const rawUsername = data.username || document.id;
      usersMap[rawUsername.toLowerCase()] = data;
    });
  } catch (err) {
    console.error("Error fetching users from Firestore:", err);
  }
  return usersMap;
}

// === QUESTIONNAIRES ===
export async function saveQuestionnaireToFirestore(q: Questionnaire): Promise<void> {
  if (!q.id) return;
  try {
    await setDoc(doc(db, "questionnaires", q.id), q);
  } catch (err) {
    console.error("Error saving questionnaire:", err);
  }
}

export async function saveAllQuestionnairesToFirestore(qs: Questionnaire[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    qs.forEach((q) => {
      if (!q.id) return;
      const ref = doc(db, "questionnaires", q.id);
      batch.set(ref, q);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving questionnaires to Firestore:", err);
  }
}

export async function fetchQuestionnairesFromFirestore(): Promise<Questionnaire[]> {
  const list: Questionnaire[] = [];
  try {
    const snapshot = await getDocs(collection(db, "questionnaires"));
    snapshot.forEach((document) => {
      list.push(document.data() as Questionnaire);
    });
  } catch (err) {
    console.error("Error fetching questionnaires:", err);
  }
  return list;
}

export async function deleteQuestionnaireFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "questionnaires", id));
  } catch (err) {
    console.error("Error deleting questionnaire:", err);
  }
}

// === RESPONSES ===
export async function saveResponseToFirestore(r: SurveyResponse): Promise<void> {
  if (!r.id) return;
  try {
    await setDoc(doc(db, "responses", r.id), r);
  } catch (err) {
    console.error("Error saving response:", err);
  }
}

export async function saveAllResponsesToFirestore(rs: SurveyResponse[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    rs.forEach((r) => {
      if (!r.id) return;
      const ref = doc(db, "responses", r.id);
      batch.set(ref, r);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving responses:", err);
  }
}

export async function fetchResponsesFromFirestore(): Promise<SurveyResponse[]> {
  const list: SurveyResponse[] = [];
  try {
    const snapshot = await getDocs(collection(db, "responses"));
    snapshot.forEach((document) => {
      list.push(document.data() as SurveyResponse);
    });
  } catch (err) {
    console.error("Error fetching responses:", err);
  }
  return list;
}

// === AUDIT LOGS ===
export async function saveAuditLogToFirestore(log: AuditLog): Promise<void> {
  if (!log.id) return;
  try {
    await setDoc(doc(db, "audit_logs", log.id), log);
  } catch (err) {
    console.error("Error saving log:", err);
  }
}

export async function saveAllAuditLogsToFirestore(logs: AuditLog[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    logs.forEach((log) => {
      if (!log.id) return;
      const ref = doc(db, "audit_logs", log.id);
      batch.set(ref, log);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving audit logs:", err);
  }
}

export async function fetchAuditLogsFromFirestore(): Promise<AuditLog[]> {
  const list: AuditLog[] = [];
  try {
    const snapshot = await getDocs(collection(db, "audit_logs"));
    snapshot.forEach((document) => {
      list.push(document.data() as AuditLog);
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
  }
  return list;
}

// === PROMOTIONS ===
export async function savePromotionToFirestore(promo: PromotionApplication): Promise<void> {
  if (!promo.id) return;
  try {
    await setDoc(doc(db, "promotions", promo.id), promo);
  } catch (err) {
    console.error("Error saving promotion:", err);
  }
}

export async function saveAllPromotionsToFirestore(promos: PromotionApplication[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    promos.forEach((p) => {
      if (!p.id) return;
      const ref = doc(db, "promotions", p.id);
      batch.set(ref, p);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving promotions:", err);
  }
}

export async function fetchPromotionsFromFirestore(): Promise<PromotionApplication[]> {
  const list: PromotionApplication[] = [];
  try {
    const snapshot = await getDocs(collection(db, "promotions"));
    snapshot.forEach((document) => {
      list.push(document.data() as PromotionApplication);
    });
  } catch (err) {
    console.error("Error fetching promotions:", err);
  }
  return list;
}

// === CHEAT REPORTS ===
export async function saveCheatReportToFirestore(report: any): Promise<void> {
  if (!report.id) return;
  try {
    await setDoc(doc(db, "cheat_reports", report.id), report);
  } catch (err) {
    console.error("Error saving cheat report:", err);
  }
}

export async function saveAllCheatReportsToFirestore(reports: any[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    reports.forEach((rep) => {
      if (!rep.id) return;
      const ref = doc(db, "cheat_reports", rep.id);
      batch.set(ref, rep);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving cheat reports:", err);
  }
}

export async function fetchCheatReportsFromFirestore(): Promise<any[]> {
  const list: any[] = [];
  try {
    const snapshot = await getDocs(collection(db, "cheat_reports"));
    snapshot.forEach((document) => {
      list.push(document.data());
    });
  } catch (err) {
    console.error("Error fetching cheat reports:", err);
  }
  return list;
}

// === QUOTA REQUESTS ===
export async function saveQuotaRequestToFirestore(req: any): Promise<void> {
  if (!req.id) return;
  try {
    await setDoc(doc(db, "quota_requests", req.id), req);
  } catch (err) {
    console.error("Error saving quota request:", err);
  }
}

export async function saveAllQuotaRequestsToFirestore(requests: any[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    requests.forEach((req) => {
      if (!req.id) return;
      const ref = doc(db, "quota_requests", req.id);
      batch.set(ref, req);
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving quota requests:", err);
  }
}

export async function fetchQuotaRequestsFromFirestore(): Promise<any[]> {
  const list: any[] = [];
  try {
    const snapshot = await getDocs(collection(db, "quota_requests"));
    snapshot.forEach((document) => {
      list.push(document.data());
    });
  } catch (err) {
    console.error("Error fetching quota requests:", err);
  }
  return list;
}

// === TRIVIA QUESTIONS ===
export async function saveAllTriviaQuestionsToFirestore(questions: any[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    questions.forEach((q, i) => {
      const qId = q.id || `trivia-${i}`;
      const ref = doc(db, "trivia_questions", String(qId));
      batch.set(ref, { ...q, id: qId });
    });
    await batch.commit();
  } catch (err) {
    console.error("Batch saving trivia questions:", err);
  }
}

export async function fetchTriviaQuestionsFromFirestore(): Promise<any[]> {
  const list: any[] = [];
  try {
    const snapshot = await getDocs(collection(db, "trivia_questions"));
    snapshot.forEach((document) => {
      list.push(document.data());
    });
  } catch (err) {
    console.error("Error fetching trivia questions:", err);
  }
  return list;
}
