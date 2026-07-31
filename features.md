Idées features

Intégré:
- [x] Dark mode — theme branché frontend + navbar/avatar intégrés.

Court terme, gros impact:

1. Transactions récurrentes — abonnements/salaire/loyer auto-générés chaque mois (Income/Expense avec flag isRecurring + frequency).
2. Alertes budget — notif quand dépense catégorie approche/dépasse limite mensuel (email ou in-app).
3. Export CSV/PDF — relevé mensuel, utile fiscalité/comptabilité perso.
4. Multi-comptes — checking/savings/carte crédit séparés, transferts entre comptes.

Moyen terme:
5. Catégories custom — user crée ses propres catégories dépenses (actuellement probablement enum fixe).
6. Analytics backend — endpoints agrégation (somme par catégorie/mois, tendances) au lieu tout calculer côté client. Meilleur perf gros volumes.
7. Objectifs récurrents/auto-épargne — règle "10% de chaque income va vers Goal X" auto.
8. Comparaison mois/mois, année/année — deltas, % variation.
9. Import bancaire — CSV/OFX import depuis relevé banque, matching auto catégories.

Plus ambitieux:
10. Prévisions/forecasting — projection solde fin mois basé historique.
11. Split/partage dépenses — colocation, couple, groupe (façon Splitwise light).
12. Notifications push/email — rappel facture à venir, résumé hebdo.
13. 2FA — sécurité vu que données financières sensibles.
14. ~~Dark mode réel~~ — fait, voir section "Intégré".
