#pragma once

#include "WordTree.h"

#include <algorithm>
#include <numeric>
#include <iterator>
#include <iostream>
#include <ctime>

void WordTree::add(const std::wstring & word)
{
	root.add(word);
	words.push_back(word);
}
bool WordTree::exist(const std::wstring & word) const
{
	return root.exist(word);
}
void WordTree::clear()
{
	root.clear();
	wordsByLength.clear();
	words.clear();
}

void WordTree::calcStats()
{
	std::map<char, double> hist;
	size_t count = 0;
	for(int i = 0; i < words.size(); i++)
	{
		Word & word = words[i];
		
		std::for_each(word.str.cbegin(), word.str.cend(), [&](char c){
			if( hist.find(c) == hist.cend()	 )
				hist.insert(std::make_pair(c, 0));
			hist[c] ++;
			count++;
		});
	}

	for(auto it = hist.begin(); it != hist.end(); ++it){
		it->second /= count;
	}


	#pragma omp parallel for
	for(int i = 0; i < words.size(); i++)
	{
		Word & word = words[i];
		word.weight = 0;
		std::for_each(word.str.begin(), word.str.end(), [&](char c){
			word.weight += hist[c];
		});
		word.weight /= word.str.size();

		#pragma omp critical
		{

			if( wordsByLength.find(word.str.size()) == wordsByLength.cend()	 )
				wordsByLength.insert(std::make_pair(word.str.size(), std::vector<Word>()));
			wordsByLength.find(word.str.size())->second.push_back(word);
		}
	}
	for(auto it = wordsByLength.begin(); it != wordsByLength.end(); ++it){
		auto & wordsByStats = it->second;
		std::sort(wordsByStats.begin(), wordsByStats.end(), [](Word & w1, Word & w2){
			return w1.weight > w2.weight;
		});
	}

	std::srand(std::time(0));
}
std::wstring WordTree::getWordByLength(size_t length, double start, double end) const
{
	std::map<size_t, std::vector<Word> >::const_iterator wordsByStatsIt = wordsByLength.find(length);
	if(wordsByStatsIt == wordsByLength.cend()) 
	{
		throw std::runtime_error("There is no words with length " + std::to_string((long long)length));
	}

	const auto & wordsByStats = wordsByStatsIt->second;

	size_t goodWordsStart = start * wordsByStats.size();
	size_t goodWordsInterval = (end - start) * wordsByStats.size();

	size_t randomIndex = std::min(goodWordsStart + std::rand() % goodWordsInterval, wordsByStats.size()-1);

// 	std::wcerr << L"goodWordsStart " << goodWordsStart << std::endl;
// 	std::wcerr << L"goodWordsInterval " << goodWordsInterval << std::endl;
// 	std::wcerr << L"size " << wordsByStats.size() << std::endl;
// 	std::wcerr << L"randomIndex " << randomIndex << std::endl;
// 	std::wcerr << L"wordsByStats " << wordsByStats[randomIndex].str << std::endl;

	return wordsByStats[randomIndex].str;
}
size_t WordTree::levenshtein_distance(const std::wstring &s1, const std::wstring &s2)
{
	size_t s1len = s1.size();
	size_t s2len = s2.size();

	auto column_start = (decltype(s1len))1;

	std::vector<int> column(s1len + 1);
	std::iota(column.begin() + column_start, column.begin() + s1len + 1, column_start);
	int possibilities[3];

	for (int x = column_start; x <= s2len; x++) {
		column[0] = x;
		int last_diagonal = x - column_start;
		for (int y = column_start; y <= s1len; y++) {
			int old_diagonal = column[y];

			possibilities[0] = column[y] + 1;
			possibilities[1] = column[y - 1] + 1;
			possibilities[2] = last_diagonal + (s1[y - 1] == s2[x - 1]? 0 : 1);

			column[y] = std::min(std::min(possibilities[0], possibilities[1]), possibilities[2]);
			last_diagonal = old_diagonal;
		}
	}
	size_t result = column[s1len];
	return result;
}