<?php

/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Sonatra\Demo;

/**
 * @author François Pluchino <francois.pluchino@sonatra.com>
 */
class AjaxDemo
{
    /**
     * Run demo.
     */
    public function run()
    {
        $max = 15;
        $pn = isset($_GET['_pn']) ? (int) $_GET['_pn'] : 1;
        $ps = isset($_GET['_ps']) ? (int) $_GET['_ps'] : 5;
        $rows = $this->getRows($pn, $ps, $max);

        $this->write(array(
            'rows'        => $rows,
            'pageNumber'  => $pn,
            'pageSize'    => $ps,
            'size'        => $max,
            'sortColumns' => array(),
        ));
    }

    /**
     * @param array $content
     */
    protected function write(array $content)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($content);
    }

    /**
     * @param int $pn  The page number
     * @param int $ps  The page size
     * @param int $max The size of list
     *
     * @return array The list of row
     */
    protected function getRows($pn, $ps, $max)
    {
        $rows = array();
        $start = ($pn - 1) * $ps;
        $end = min($start + $ps, $max);

        for ($i = $start+1; $i <= $end; $i++) {
            $rows[] = array(
                '_row_number' => $i,
                '_row_id'     => $i,
                'id'          => (string) $i,
                'firstname'   => 'First name '.$i,
                'lastname'    => 'Last name '.$i,
                'username'    => 'Username '.$i,
            );
        }

        return $rows;
    }
}

$demo = new AjaxDemo();
$demo->run();
