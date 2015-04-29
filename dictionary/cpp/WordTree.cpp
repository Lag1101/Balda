#pragma once

#include "WordTree.h"

#include <algorithm>
#include <numeric>
#include <iterator>


void WordTree::add(const std::string & word)
{
	root.add(word);
	words.push_back(word);
}
bool WordTree::exist(const std::string & word) const
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
	#pragma omp parallel for
	for(int i = 0; i < words.size(); i++)
	{
		Word & word = words[i];
		size_t weight = 0;
		std::for_each(words.begin(), words.end(), [&](const Word & comparingWord){
			size_t distance = levenshtein_distance(word.str, comparingWord.str);

			weight += (distance <= 3) ? 1 : 0;
		});

		#pragma omp critical
		{
			wordsByLength[word.str.size()].push_back(word);
		}
	}

	std::for_each(wordsByLength.begin(), wordsByLength.end(), [](std::pair<size_t, std::vector<Word>> pair){
		auto & wordsByStats = pair.second;
		std::sort(wordsByStats.begin(), wordsByStats.end(), [](Word & w1, Word & w2){
			return w1.weight < w2.weight;
		});
	});
}
std::string WordTree::getEasyWordByLength(size_t length) const
{
	auto wordsByStatsIt = wordsByLength.find(length);
	if(wordsByStatsIt == wordsByLength.cbegin()) return "";

	const auto & wordsByStats = wordsByStatsIt->second;

	double alpha = 0.1;

	size_t goodWordsInterval = alpha * wordsByStats.size();

	size_t randomIndex = goodWordsInterval * (std::rand() / (double) RAND_MAX);

	return wordsByStats[randomIndex].str;
}
size_t WordTree::levenshtein_distance(const std::string &s1, const std::string &s2)
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