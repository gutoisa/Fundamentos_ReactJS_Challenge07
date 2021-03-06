/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import { title } from 'process';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const transaction = await api.get('transactions');
      // console.log(transaction.data);
      // console.log(transaction.data.transactions);

      const formatedTransaction = transaction.data.transactions.map(
        (transact: Transaction) => ({
          ...transact,
          formattedValue: formatValue(transact.value),
          formattedDate: new Date(transact.created_at).toLocaleDateString(
            'pt-br',
          ),
        }),
      );

      const formatedBalance = {
        income: formatValue(transaction.data.balance.income),
        outcome: formatValue(transaction.data.balance.outcome),
        total: formatValue(transaction.data.balance.total),
      };
      setTransactions(formatedTransaction);
      setBalance(formatedBalance);
    }

    loadTransactions();
  }, []);
  console.log(transactions[1]);
  console.log(transactions);
  transactions.map(transaction => {
    // console.log(transaction);
  });
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr>
                  <td className="title">{transaction.title}</td>
                  <td className="income">{transaction.formattedValue}</td>
                  <td>categoria</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
